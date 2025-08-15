import { useState, useEffect } from "react";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { FaChartArea, FaChartLine } from "react-icons/fa";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { apiRequest } from "../../lib/apiRequest";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { ErrorFallback, Loader } from "../ui/Loaders";
import { BsGraphUpArrow } from "react-icons/bs";

const ProfitChart = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("line");
  const [dateRange, setDateRange] = useState([null, null]);
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

        const response = await apiRequest.get(`/stats/profits`, {
          params: {
            period: timeRange ? undefined : timeFrame,
            timeRange
          }
        });
        
        setChartData(response.data.data);
        setError("");
      } catch (err) {
        setError("Failed to load profit data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame, dateRange]);

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
        const start = new Date(dateObj);
        const end = new Date(dateObj);
        end.setDate(start.getDate() + 6);
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { day: 'numeric' })}`;
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
          <div className="font-bold text-center text-lg mb-2 text-cyan-800">
            {formatDate(data.date)}
          </div>
          <div className="grid gap-2">
            <p className="text-sm bg-green-50 p-2 rounded">
              <span className="font-semibold font-poppins">Total Profit:</span> ${data.totalProfit?.toFixed(2)}
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
      className={`sm:px-3 py-1 rounded-lg flex items-center gap-2 px-2 ${
        chartType === type 
          ? 'bg-[#5a6e63] text-slate-100'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <span className="material-icons">{icon}</span>
      {label}
    </button>
  );

  const renderChart = () => {
    const gradientColors = ['#8aa9cc', '#ccb12e'];
    
    return (
      <ResponsiveContainer width="100%" height="100%" >
        {chartType === 'area' ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" className=" font-poppins" stopColor={gradientColors[0]} stopOpacity={0.4}/>
                <stop offset="95%" className=" font-poppins" stopColor={gradientColors[1]} stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className=" font-poppins" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={80}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              width={50}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="totalProfit"
              stroke={gradientColors[0]}
              strokeWidth={2}
              fill="url(#colorProfit)"
              name="Total Profit"
            />
          </AreaChart>
        ) : chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" className=" font-poppins"/>
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={80}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="totalProfit"
              stroke={gradientColors[0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[1], strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name="Total Profit"
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} className=" font-poppins">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12,fontFamily: "poppins", fontStyle: "bold" }}
              interval={0}
              tickLine={false}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              tick={{ fill: '#6b7280', fontSize: 10 }}
              tickLine={false}
             width={36}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Bar
              dataKey="totalProfit"
              fill={gradientColors[0]}
              radius={[4, 4, 0, 0]}
              name="Total Profit"
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 h-full flex flex-col shadow-sm font-poppins">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 text-nowrap flex items-center gap-2">
          <BsGraphUpArrow className="text-teal-800" /> 
          <span>Profit Analysis</span>
        </h1>
        
        <div className="flex flex-wrap gap-3 items-center pt-3">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <ChartTypeButton type="bar" label="Bars" icon={<RiBarChartGroupedLine />}/>
            <ChartTypeButton type="area" label="Area" icon={<FaChartArea />} />
            <ChartTypeButton type="line" label="Lines" icon={<FaChartLine />} />
          </div>

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
                <SelectItem value="daily">Last 30 Days</SelectItem>
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
          <Loader className="w-12 h-12" />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <ErrorFallback message = {error}/>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium  font-poppins">No profit data for selected period</p>
        </div>
      ) : (
        <div className="flex-1 h-full lg:min-h-[400px]">
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default ProfitChart;