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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { Loader, ErrorFallback } from "../ui/Loaders";
import ChartTypeSelector from "../ChartTypeSelector";

const gradientColors = {
  top: ['#7ca97c', '#6CF300'],
  least: ['#ef4444', '#f87171']
};

const BrandProductsSalesChart = ({ brandId }) => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [performanceType, setPerformanceType] = useState("top");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);
  
  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    sort: performanceType === 'top' ? 'desc' : 'asc',
    timeRange: dateRange[0] && dateRange[1] 
      ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
      : undefined
  };
  
  const { data, loading, error } = useChartData(
    `/stats/brand/${brandId}/product-sales`, 
    params, 
    [timeFrame, performanceType, dateRange, brandId]
  );

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          {item.image && (
            <img 
              src={item.image} 
              alt={item.productName} 
              className="w-20 h-20 object-cover mb-3 mx-auto rounded-lg"
            />
          )}
          <h3 className="font-bold text-center text-lg mb-2">{item.productName}</h3>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">ID:</span> {item.productId}
            </p>
            <p className="text-sm bg-orange-50 p-2 rounded">
              <span className="font-semibold">Total Sold:</span> {item.totalSold}
            </p>
            <p className="text-sm bg-green-50 p-2 rounded">
              <span className="font-semibold">Revenue:</span> ${item.totalRevenue?.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = {
      data,
      margin: { top: 20, right: 10, left: 10, bottom: 5 }
    };

    switch(chartType) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[performanceType][0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradientColors[performanceType][1]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="productName"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="totalSold"
              stroke={gradientColors[performanceType][0]}
              fillOpacity={1}
              fill="url(#colorSales)"
              strokeWidth={2}
              name="Units Sold"
            />
          </AreaChart>
        );

      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="productName"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="totalSold"
              stroke={gradientColors[performanceType][0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[performanceType][1], strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name="Units Sold"
            />
          </LineChart>
        );

      default:
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="productName"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Bar
              dataKey="totalSold"
              fill={gradientColors[performanceType][0]}
              radius={[4, 4, 0, 0]}
              name="Units Sold"
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 text-nowrap flex items-center gap-2">
          {performanceType === 'top' ? (
            <>
              <BsGraphUpArrow className="text-teal-800" /> 
              <span>Top Selling Products</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Low Selling Products</span>
            </>
          )}
        </h1>
        
        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
          
          <Select 
            value={performanceType}
            onValueChange={(value) => setPerformanceType(value)}
          >
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 items-center text-nowrap flex flex-row justify-between">
              <SelectValue placeholder="Performance Type" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="top">Top Performers</SelectItem>
                <SelectItem value="least">Low Performers</SelectItem>
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
              <SelectValue placeholder="Time Frame" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="daily">Today</SelectItem>
                <SelectItem value="weekly">This Week</SelectItem>
                <SelectItem value="monthly">This Month</SelectItem>
                <SelectItem value="yearly">This Year</SelectItem>
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
          <p className="text-gray-500 font-medium">No sales data available for selected period</p>
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

export default BrandProductsSalesChart;