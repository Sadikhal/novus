import { useState } from "react";
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from "recharts";
import { useChartData } from "../../hooks/useChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorFallback, Loader } from "../ui/Loaders";
import ChartTypeSelector from "../ChartTypeSelector";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsPersonLinesFill } from "react-icons/bs";

const gradientColors = {
  products: ['#5F9A7D', '#10B981'],
  orders: ['#065C71', '#EC4899']
};

const CustomerPerformanceChart = ({ customerId }) => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dataType, setDataType] = useState("products");
  
  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    timeRange: dateRange[0] && dateRange[1] 
      ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
      : undefined,
    customerId
  };
  
  const { data, loading, error } = useChartData(
    `/stats/customer/${customerId}`, 
    params, 
    [timeFrame, dateRange, customerId]
  );

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const isCustomRange = dateRange[0] && dateRange[1];
    
    if (isCustomRange) {
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }

    const options = {
      daily: { month: 'short', day: 'numeric' },
      weekly: () => {
        const weekStart = new Date(dateObj);
        const weekEnd = new Date(dateObj);
        weekEnd.setDate(weekStart.getDate() + 6);
        return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { day: 'numeric' })}`;
      },
      monthly: { year: 'numeric', month: 'short' },
      yearly: { year: 'numeric' }
    };
    
    if (timeFrame === 'weekly') {
      return options.weekly();
    }
    return dateObj.toLocaleDateString('en-US', options[timeFrame]);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-lg mb-2 text-blue-600">
            {formatDate(data.date)}
          </div>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Products Purchased:</span> {data.productCount}
            </p>
            <p className="text-sm bg-purple-50 p-2 rounded">
              <span className="font-semibold">Orders Placed:</span> {data.orderCount}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = {
      data: data,
      margin: { top: 20, right: 10, left: 10, bottom: 5 }
    };

    const dataKey = dataType === "products" ? "productCount" : "orderCount";
    const yAxisFormatter = dataType === "products" 
      ? (value) => `${value} units`
      : (value) => `${value} orders`;

    switch(chartType) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[dataType][0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradientColors[dataType][1]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis 
              tickFormatter={yAxisFormatter}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColors[dataType][0]}
              strokeWidth={2}
              fill="url(#colorPerformance)"
              name={dataType === "products" ? "Products Purchased" : "Orders Placed"}
            />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis 
              tickFormatter={yAxisFormatter}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColors[dataType][0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[dataType][1], strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name={dataType === "products" ? "Products Purchased" : "Orders Placed"}
            />
          </LineChart>
        );
      default:
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis 
              tickFormatter={yAxisFormatter}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Bar
              dataKey={dataKey}
              fill={gradientColors[dataType][0]}
              radius={[4, 4, 0, 0]}
              name={dataType === "products" ? "Products Purchased" : "Orders Placed"}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl sm:p-4 p-1 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="sm:text-xl text-lg font-bold text-gray-800 text-nowrap flex items-center gap-2">
          <BsPersonLinesFill className="text-teal-800" /> 
          <span>Customer Purchase Activity</span>
        </h1>
        
        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
          
          <Select
            value={dataType}
            onValueChange={(value) => setDataType(value)}
          >
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm min-w-44 items-center text-nowrap flex flex-row justify-between">
              <SelectValue placeholder="Data Type" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="products">Products Purchased</SelectItem>
                <SelectItem value="orders">Orders Placed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select
            value={timeFrame}
            onValueChange={(value) => setTimeFrame(value)}
          >
            <SelectTrigger 
              className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 items-center text-nowrap flex flex-row justify-between" 
              disabled={dateRange[0] !== null}
            >
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            placeholderText="Custom Date Range"
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm w-48"
            isClearable
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <ErrorFallback message={error} />
        </div>
      ) : (!data || data.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No purchase data available</p>
        </div>
      ) : (
        <div className="flex-1 h-full min-h-[500px]">
          <ResponsiveContainer width="100%" height="95%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default CustomerPerformanceChart;