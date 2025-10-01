import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphUpArrow } from "react-icons/bs";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { FaChartArea, FaChartLine } from "react-icons/fa";
import { ScrollArea } from "../ui/ScrollArea";
import { apiRequest } from "../../lib/apiRequest";
import { ErrorFallback } from "../ui/Loaders";

const gradientColors = ["#8aa9cc", "#095ab5"];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const ProfitChart = () => {
  const [chartType, setChartType] = useState("bar"); 
  const [timeFrame, setTimeFrame] = useState("daily");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [startDate, endDate] = dateRange;
        const timeRange = startDate && endDate
          ? `${startDate.toISOString()}_${endDate.toISOString()}`
          : undefined;

        const response = await apiRequest.get("/stats/profits", {
          params: {
            period: timeRange ? undefined : timeFrame,
            timeRange,
          },
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

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const safeData = useMemo(() => {
    if (!Array.isArray(chartData)) return [];
    return chartData.map(d => ({
      date: d.date,
      totalProfit: Number(d.totalProfit ?? 0),
    }));
  }, [chartData]);

  const { chartWidth, barSize } = useMemo(() => {
    const points = safeData.length || 0;
    const minBarWidth = 38;
    const defaultGap = 16;

    if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth };

    const totalLabelWidth = points * minBarWidth;
    const totalGap = points > 1 ? (points - 1) * defaultGap : 0;

    let calculatedBarSize = minBarWidth;
    const totalRequiredWidth = totalLabelWidth + totalGap;

    if (totalRequiredWidth <= containerWidth) {
      const scale = (containerWidth - totalGap) / totalLabelWidth;
      calculatedBarSize = Math.max(minBarWidth, Math.min(minBarWidth + 10, minBarWidth * scale));
    }

    return {
      chartWidth: Math.max(containerWidth, totalRequiredWidth + totalGap),
      barSize: calculatedBarSize,
    };
  }, [safeData, containerWidth]);

  const isOverflowing = chartWidth > containerWidth;

  // Format X-axis label
  const formatXAxisLabel = (dateStr) => {
    const dateObj = new Date(dateStr);
    const options = { month: "short", day: "numeric" };
    return dateObj.toLocaleDateString("en-US", options);
  };

  // Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const dateObj = new Date(d.date);
      const formattedDate = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      return (
        <div className="bg-white border-l-4 border-teal-500 p-3 rounded-lg shadow-lg">
          <div className="font-semibold text-gray-800 text-center mb-1">{formattedDate}</div>
          <div className="text-sm bg-green-50 p-2 rounded">
            <span className="font-semibold">Profit:</span> ₹{d.totalProfit?.toFixed(2)}
          </div>
        </div>
      );
    }
    return null;
  };

  const barGradientsDefs = () =>
    safeData.map((_, i) => (
      <linearGradient id={`profitGrad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={0.98} />
        <stop offset="100%" stopColor={gradientColors[1]} stopOpacity={0.62} />
      </linearGradient>
    ));

  const renderChart = () => {
    if (chartType === "line") {
      return (
        <LineChart data={safeData} width={chartWidth} height={400}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisLabel}
            interval={0}
            tick={{ fontSize: 12, fill: "#4b5563", fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#d1d5db" }}
            height={60}
            angle={0}
            textAnchor="middle"
          />
          <YAxis
            tickFormatter={v => `₹${v}`}
            width={70}
            tick={{ fontSize: 13, fill: "#4b5563", fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
          <Line
            type="monotone"
            dataKey="totalProfit"
            stroke={gradientColors[0]}
            strokeWidth={2}
            dot={{ fill: gradientColors[1], strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Total Profit"
          />
        </LineChart>
      );
    } else if (chartType === "area") {
      return (
        <AreaChart data={safeData} width={chartWidth} height={400}>
          <defs>
            <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={0.4} />
              <stop offset="100%" stopColor={gradientColors[1]} stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisLabel}
            interval={0}
            tick={{ fontSize: 12, fill: "#4b5563", fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#d1d5db" }}
            height={60}
            angle={0}
            textAnchor="middle"
          />
          <YAxis
            tickFormatter={v => `₹${v}`}
            width={70}
            tick={{ fontSize: 13, fill: "#4b5563", fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
          <Area
            type="monotone"
            dataKey="totalProfit"
            stroke={gradientColors[0]}
            strokeWidth={2}
            fill="url(#colorProfit)"
            name="Total Profit"
          />
        </AreaChart>
      );
    } else {
      return (
        <BarChart data={safeData} width={chartWidth} height={400}>
          <defs>{barGradientsDefs()}</defs>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxisLabel}
            interval={0}
            tick={{ fontSize: 12, fill: "#4b5563", fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#d1d5db" }}
            height={60}
            angle={0}
            textAnchor="middle"
          />
          <YAxis
            tickFormatter={v => `₹${v}`}
            width={70}
            tick={{ fontSize: 13, fill: "#4b5563", fontWeight: 500 }}
            axisLine={{ stroke: "#e5e7eb" }}
            tickLine={{ stroke: "#d1d5db" }}
          />
          <Tooltip content={<CustomTooltip />} />
            <Legend iconType="square" />
          <Bar dataKey="totalProfit" radius={[4, 4, 0, 0]} maxBarSize={barSize} isAnimationActive animationDuration={900}>
            {safeData.map((entry, idx) => (
              <Cell
                key={`cell-${idx}`}
                fill={`url(#profitGrad-${idx})`}
                style={{ transition: "transform 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "scaleY(1.05)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "scaleY(1)")}
              />
            ))}
          </Bar>
        </BarChart>
      );
    }
  };

  const ChartTypeButton = ({ type, label, icon }) => (
    <button
      onClick={() => setChartType(type)}
      className={`sm:px-3 py-1 rounded-lg flex items-center gap-2 px-2 cursor-pointer ${
        chartType === type ? "bg-[#5a6e63] text-slate-100" : "bg-gray-100 hover:bg-gray-200"
      }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-md border border-gray-100">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="md:text-xl text-lg font-bold text-gray-800 flex items-center gap-2">
          <BsGraphUpArrow className="text-teal-800" />
          <span>Profit Analysis</span>
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 text-sm md:text-base bg-gray-100 p-1 rounded-lg">
            <ChartTypeButton type="bar" label="Bars" icon={<RiBarChartGroupedLine />} />
            <ChartTypeButton type="line" label="Line" icon={<FaChartLine />} />
            <ChartTypeButton type="area" label="Area" icon={<FaChartArea />} />
          </div>

          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger
              className="border-gray-200 rounded-lg px-2 py-2 sm:text-sm bg-white shadow-sm w-36 md:w-44 flex justify-between items-center md:text-sm text-xs"
              disabled={dateRange[0] !== null}
            >
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white w-36 md:w-44">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs"  value="daily">Last 30 Days</SelectItem>
                <SelectItem className="md:text-sm text-xs"  value="weekly">Weekly</SelectItem>
                <SelectItem className="md:text-sm text-xs"  value="monthly">Monthly</SelectItem>
                <SelectItem className="md:text-sm text-xs"  value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            placeholderText="Custom Date Range"
            className="border border-gray-200 rounded-lg px-3 py-2 w-36 md:w-48 text-xs md:text-sm bg-white shadow-sm"
            isClearable
          />
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <ChartSkeleton />
        </div>
      ) : error ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
          <ErrorFallback message={error} />
        </div>
      ) : safeData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No profit data for selected period</p>
        </div>
      ) : (
        <div className="flex-1 h-full min-h-[400px] relative">
          {isOverflowing && (
            <>
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white via-white/60 to-transparent" />
              <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white via-white/60 to-transparent" />
            </>
          )}
          <ScrollArea orientation="horizontal" className="h-full">
            <div style={{ minWidth: `${chartWidth}px`, height: "100%" }}>{renderChart()}</div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default ProfitChart;
