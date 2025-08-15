import { useState } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useChartData } from "../../hooks/useChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorFallback, Loader } from "../ui/Loaders";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import ChartTypeSelector from "../ChartTypeSelector";

const FinancialChart = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);
  
  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    timeRange: dateRange[0] && dateRange[1] 
      ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
      : undefined
  };
  
  const { data, loading, error } = useChartData("/stats/revenue", params, [timeFrame, dateRange]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const isCustomRange = dateRange[0] && dateRange[1];
    
    if (isCustomRange) {
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    if (timeFrame === 'weekly') {
      const start = new Date(dateObj);
      const end = new Date(dateObj);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { day: 'numeric' })}`;
    }

    const options = {
      daily: { month: 'short', day: 'numeric' },
      monthly: { year: 'numeric', month: 'short' },
      yearly: { year: 'numeric' }
    };
    
    return dateObj.toLocaleDateString('en-US', options[timeFrame]);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-lg mb-2 text-cyan-900">
            {formatDate(data.date)}
          </div>
          <div className="grid gap-2">
            <p className="text-sm bg-green-50 p-2 rounded">
              <span className="font-semibold">Revenue:</span> ${data.revenue?.toFixed(2)}
            </p>
            <p className="text-sm bg-red-50 p-2 rounded">
              <span className="font-semibold">Expenditure:</span> ${data.expenditure?.toFixed(2)}
            </p>
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Profit:</span> ${(data.revenue - data.expenditure)?.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const colors = {
      revenue: '#5a6e63',
      expenditure: '#acad70'
    };
    
    switch(chartType) {
      case 'area':
        return (
          <AreaChart data={data} className="font-poppins">
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={colors.revenue} stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorExpenditure" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors.expenditure} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={colors.expenditure} stopOpacity={0.2}/>
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
              height={80}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 11 }}
              width={40}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke={colors.revenue}
              strokeWidth={2}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="expenditure"
              stroke={colors.expenditure}
              strokeWidth={2}
              fill="url(#colorExpenditure)"
              name="Expenditure"
            />
          </AreaChart>
        );
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
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
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke={colors.revenue}
              strokeWidth={2}
              dot={{ fill: colors.revenue, strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="expenditure"
              stroke={colors.expenditure}
              strokeWidth={2}
              dot={{ fill: colors.expenditure, strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name="Expenditure"
            />
          </LineChart>
        );
      default:
        return (
          <BarChart data={data}>
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
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            <Bar
              dataKey="revenue"
              fill={colors.revenue}
              radius={[4, 4, 0, 0]}
              name="Revenue"
            />
            <Bar
              dataKey="expenditure"
              fill={colors.expenditure}
              radius={[4, 4, 0, 0]}
              name="Expenditure"
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          Financial Overview
        </h1>
        
        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />
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
          <ErrorFallback message={error}/>
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No financial data available</p>
        </div>
      ) : (
        <div className="flex-1 h-full min-h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default FinancialChart;