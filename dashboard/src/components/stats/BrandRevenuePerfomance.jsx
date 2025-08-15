import { useState, useEffect } from "react";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { FaChartArea, FaChartLine } from "react-icons/fa";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {Loader} from "../ui/Loaders";
import { apiRequest } from "../../lib/apiRequest";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";

const BrandRevenuePerformanceChart = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [performanceType, setPerformanceType] = useState("top");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartType, setChartType] = useState("area");
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [startDate, endDate] = dateRange;
        const timeRange = startDate && endDate 
          ? `${startDate.toISOString()}_${endDate.toISOString()}`
          : undefined;

        const response = await apiRequest.get(
          `/stats/brands-revenue-performance`, {
            params: {
              period: timeRange ? undefined : timeFrame,
              sort: performanceType === 'top' ? 'desc' : 'asc',
              timeRange
            }
          }
        );
        
        setChartData(response.data);
        setError("");
      } catch (err) {
        setError("Failed to load brand performance data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame, performanceType, dateRange]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <img 
            src={data.logo} 
            alt={data.brand} 
            className="w-20 h-20 object-contain mb-3 mx-auto rounded-lg"
          />
          <h3 className="font-bold text-center text-lg mb-2">{data.brand}</h3>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Total Revenue:</span> ${data.totalRevenue?.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const ChartTypeButton = ({ type, label, icon }) => (
    <button
      onClick={() => setChartType(type)}
      className={`sm:px-3 py-1 rounded-lg flex items-center gap-2 px-[6px] ${
        chartType === type 
          ? 'bg-[#3d3209a6] text-slate-100'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <span className="material-icons">{icon}</span>
      {label}
    </button>
  );

  const renderChart = () => {
    const chartProps = {
      data: chartData,
      margin: { top: 20, right: 10, left: 10, bottom: 5 }
    };

    const gradientColors = {
      top: ['#3d3209a6','#f9f871'],
      least: ['#c34a36', '#ffc75f']
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
              dataKey="brand"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              width={60}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="totalRevenue"
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
              dataKey="brand"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              width={60}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="totalRevenue"
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
              dataKey="brand"
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              width={60}
              tick={{ fontSize: 14 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Bar
              dataKey="totalRevenue"
              fill={gradientColors[performanceType][0]}
              radius={[4, 4, 0, 0]}
              name="Total Revenue"
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-1  sm:p-3 md:p-4 lg:p-6 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="sm:text-xl text-md font-bold text-gray-800 text-nowrap flex items-center gap-2">
          {performanceType === 'top' ? (
            <>
              <BsGraphUpArrow className="text-teal-800" /> 
              <span>Top Performing Brands</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Least Performing Brands</span>
            </>
          )}
        </h2>
        <div className="flex flex-wrap gap-3 items-center pt-3">
          <div className="flex gap-1 sm:gap-2 bg-gray-100 p-1 rounded-lg">
            <ChartTypeButton type="bar" label="Bars" icon={<RiBarChartGroupedLine />}/>
            <ChartTypeButton type="area" label="Area" icon={<FaChartArea />} />
            <ChartTypeButton type="line" label="Lines" icon={<FaChartLine />} />
          </div>

          <Select 
            value={performanceType}
            onValueChange={(value) => setPerformanceType(value)}
          >
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 items-center text-nowrap flex flex-row justify-between">
              <SelectValue placeholder="Select performance" />
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
              <SelectValue placeholder="Select timeframe" />
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
          <Loader className="w-12 h-12" />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <span className="material-icons text-red-500 text-4xl mb-4">error</span>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No revenue data for selected period</p>
        </div>
      ) : (
        <div className="flex-1 h-full flex lg:min-h-[500px]">
          <ResponsiveContainer width="100%" height="95%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default BrandRevenuePerformanceChart;