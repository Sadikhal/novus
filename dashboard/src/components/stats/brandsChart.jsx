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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import {Loader} from "../ui/Loaders";
import { BsGraphUpArrow } from "react-icons/bs";

const brandColors = [
  '#206783', '#4d8076', '#8f3f7f', '#2c5f2d',
  '#ff6f61', '#6b5b95', '#88b04b', '#f7cac9',
  '#92a8d1', '#955251', '#b565a7', '#009b77',
  '#dd4124', '#d65076', '#45b8ac', '#efc050',
  '#5b5ea6', '#9b2335', '#dfcfbe', '#55b4b0'
];

const BrandsPerformanceChart = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartData, setChartData] = useState([]);
  const [brands, setBrands] = useState([]);

  const { data: apiData, loading, error } = useChartData("/stats/brands", params, [timeFrame, dateRange]);

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
      const date = payload[0].payload.date;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-lg mb-2 text-blue-600">
            {formatDate(date)}
          </div>
          <div className="grid gap-2">
            {payload.map((entry, index) => (
              <p 
                key={entry.dataKey} 
                className="text-sm p-2 rounded"
                style={{ 
                  backgroundColor: `${entry.color}20`,
                  borderLeft: `4px solid ${entry.color}`
                }}
              >
                <span className="font-semibold">{entry.name}:</span> ${entry.value.toFixed(2)}
              </p>
            ))}
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
          ? 'bg-[#3d3209a6] text-slate-100'
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      <span className="material-icons">{icon}</span>
      {label}
    </button>
  );

  const renderChart = () => {
    const chartElements = brands.map((brand, index) => {
      const color = brandColors[index % brandColors.length];
      
      switch(chartType) {
        case 'area':
          return (
            <Area
              key={brand}
              type="monotone"
              dataKey={brand}
              stroke={color}
              strokeWidth={1.5}
              fillOpacity={0.2}
              fill={color}
              name={brand}
              dot={false}
            />
          );
        case 'line':
          return (
            <Line
              key={brand}
              type="monotone"
              dataKey={brand}
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name={brand}
            />
          );
        default:
          return (
            <Bar
              key={brand}
              dataKey={brand}
              fill={color}
              radius={[4, 4, 0, 0]}
              name={brand}
            />
          );
      }
    });

    return (
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'area' ? (
          <AreaChart data={chartData}>
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
              tickFormatter={value => `$${value}`}
              tick={{ fill: '#6b7280', fontSize: 11 }}
              width={20}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            {chartElements}
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
              height={80}
            />
            <YAxis 
              tickFormatter={value => `$${value}`}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            {chartElements}
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
              tickFormatter={value => `$${value}`}
              tick={{ fill: '#6b7280', fontSize: 12 }}
              tickLine={false}
              width={20}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              formatter={(value) => <span className="text-gray-600">{value}</span>}
              iconType="circle"
            />
            {chartElements}
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <div className="bg-white rounded-xl p-2 sm:p-3 md:p-4 lg:p-6 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 text-nowrap flex items-center gap-2">
          <BsGraphUpArrow className="text-teal-800" /> 
          <span>Brands Performance</span>
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
          <span className="material-icons text-red-500 text-4xl mb-4">error</span>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <span className="material-icons text-gray-400 text-4xl mb-4">inventory_2</span>
          <p className="text-gray-500 font-medium">No revenue data for selected period</p>
        </div>
      ) : (
        <div className="flex-1 h-full lg:min-h-[400px]">
          {renderChart()}
        </div>
      )}
    </div>
  );
};

export default BrandsPerformanceChart;
