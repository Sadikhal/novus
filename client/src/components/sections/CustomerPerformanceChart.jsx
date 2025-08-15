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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { ChevronDown } from "lucide-react";
import { BsPersonLinesFill } from "react-icons/bs";
import { apiRequest } from "../../lib/apiRequest";
import { Loader } from "../../components/ui/Loaders";
import { ErrorFallback } from "../../components/sections/ErrorFallback";

const CustomerPerformanceChart = ({ customerId }) => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const [startDate, endDate] = dateRange;
        const timeRange = startDate && endDate 
          ? `${startDate.toISOString()}_${endDate.toISOString()}`
          : undefined;

        const response = await apiRequest.get(`/stats/customer/${customerId}`, {
          params: {
            period: timeRange ? undefined : timeFrame,
            timeRange,
            customerId
          }
        });
        
        const processedData = response.data.data.map(item => ({
          ...item,
          date: new Date(item.date)
        }));
        
        setChartData(processedData || []);
      
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) fetchData();
  }, [timeFrame, dateRange, customerId]);

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
        <div className="bg-lamaWhite p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-lg mb-2 text-[#3f71a3] font-poppins">
            {formatDate(data.date)}
          </div>
          <div className="grid gap-2 text-slate-100">
            <p className="text-sm bg-[#876b6b] p-2 rounded">
              <span className="font-semibold">Products Bought:</span> {data.productCount}
            </p>
            <p className="text-sm bg-[#445647] p-2 rounded">
              <span className="font-semibold">Orders Placed:</span> {data.orderCount}
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
          ? 'bg-[#7fb324] text-slate-100'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <span className="material-icons">{icon}</span>
      {label}
    </button>
  );

  const renderChart = () => {
    const gradientColors = ['#13496be6', '#10B981'];
    
    return (
      <ResponsiveContainer width="100%" height={500}>
        {chartType === 'area' ? (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProducts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={gradientColors[1]} stopOpacity={0.2}/>
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
              height={90}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 13 }}
              width={30}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="productCount"
              stroke={gradientColors[0]}
              strokeWidth={2}
              fill="url(#colorProducts)"
              name="Products Purchased"
            />
          </AreaChart>
        ) : chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={130}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-800">{value}</span>}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="productCount"
              stroke={gradientColors[0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[1], strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name="Products Purchased"
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 13 }}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-800">{value}</span>}
              iconType="circle"
            />
            <Bar
              dataKey="productCount"
              fill={gradientColors[0]}
              radius={[4, 4, 0, 0]}
              name="Products Purchased"
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 h-full flex flex-col shadow-sm font-poppins">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 text-nowrap flex items-center gap-2 pt-3">
          <BsPersonLinesFill className="text-[#324875] " /> 
          <span className="font-poppins">Customer Purchase Activity</span>
        </h1>
        
        <div className="flex flex-wrap gap-3 items-center pt-3">
          <div className="flex gap-2 bg-gray-200 p-1 rounded-lg text-teal-800 font-poppins text-[15px]">
            <ChartTypeButton type="bar" label="Bars" icon={<RiBarChartGroupedLine />}/>
            <ChartTypeButton type="area" label="Area" icon={<FaChartArea />} />
            <ChartTypeButton type="line" label="Lines" icon={<FaChartLine />} />
          </div>

          <Select
            value={timeFrame}
            onValueChange={(value) => setTimeFrame(value)}
          >
            <SelectTrigger 
              className="border-gray-200 border rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 font-poppins items-center text-nowrap flex flex-row justify-between text-[#686767]" 
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
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm text-[#4f4e4e] w-48 font-poppins"
            isClearable
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader/>
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <ErrorFallback message={error}/>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-600 font-medium font-poppins">No purchase data for selected period</p>
        </div>
      ) : (
        <div className="flex-1 h-[500px]">
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default CustomerPerformanceChart;