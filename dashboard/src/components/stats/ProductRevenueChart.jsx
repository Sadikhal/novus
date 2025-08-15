import { useState } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useChartData } from "../../hooks/useChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorFallback, Loader } from "../ui/Loaders";
import ChartTypeSelector from "../ChartTypeSelector";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";

const gradientColors = {
  top: ['#3d3209a6','#f9f871'],
  least: ['#c34a36', '#ffc75f']
};

const ProductPerformanceChart = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [performanceType, setPerformanceType] = useState("top");
  const [chartType, setChartType] = useState("line");
  const [dateRange, setDateRange] = useState([null, null]);
  
  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    sort: performanceType === 'top' ? 'desc' : 'asc',
    timeRange: dateRange[0] && dateRange[1] 
      ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
      : undefined
  };
  
  const { data, loading, error } = useChartData("/stats/products-revenue-performance", params, [timeFrame, performanceType, dateRange]);

  const formatCurrency = (value) => 
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <h3 className="font-bold text-center text-lg mb-2">{data.product}</h3>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Revenue:</span> {formatCurrency(data.revenue)}
            </p>
            <p className="text-sm bg-orange-50 p-2 rounded">
              <span className="font-semibold">Units Sold:</span> {data.unitsSold}
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

    switch(chartType) {
      case 'area':
        return (
          <AreaChart {...chartProps}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[performanceType][0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={gradientColors[performanceType][1]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="product"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis 
              tickFormatter={value => `$${value}`} 
              width={60}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={gradientColors[performanceType][0]}
              fillOpacity={1}
              fill="url(#colorUv)"
              strokeWidth={2}
              name="Total Revenue"
            />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="product"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              width={60}
              tick={{ fontSize: 14 }} 
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={gradientColors[performanceType][0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[performanceType][1], strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name="Total Revenue"
            />
          </LineChart>
        );
      default:
        return (
          <BarChart {...chartProps}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="product"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
            />
            <YAxis 
              tickFormatter={value => `$${value}`} 
              width={60}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="revenue"
              fill={gradientColors[performanceType][0]}
              radius={[4, 4, 0, 0]}
              name="Total Revenue"
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="sm:text-xl text-lg font-bold text-gray-800 text-nowrap flex items-center gap-2">
          {performanceType === 'top' ? (
            <>
              <BsGraphUpArrow className="text-teal-800" /> 
              <span>Top Performing Products</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Least Performing Products</span>
            </>
          )}
        </h1>
        
        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
          
          <Select 
            value={performanceType}
            onValueChange={(value) => setPerformanceType(value)}
          >
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44">
              <SelectValue placeholder="Performance Type" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
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
              className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44"
              disabled={dateRange[0] !== null}
            >
              <SelectValue placeholder="Time Frame" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent>
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
          <p className="text-gray-500 font-medium">No performance data for selected period</p>
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

export default ProductPerformanceChart;