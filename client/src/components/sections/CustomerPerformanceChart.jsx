import { useState, useMemo, useEffect, useRef } from "react";
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
  Legend,
  Cell,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { ChevronDown } from "lucide-react";
import { BsPersonLinesFill } from "react-icons/bs";
import { RiBarChartGroupedLine } from "react-icons/ri";
import { FaChartArea, FaChartLine } from "react-icons/fa";
import { apiRequest } from "../../lib/apiRequest";
import { ErrorFallback } from "../../components/sections/ErrorFallback";
import { ScrollArea } from "../../components/ui/ScrollArea";

const gradientColors = {
   products: ['#b8ded1', '#114735'],
  orders: ['#065C71', '#EC4899']
};

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const ChartTypeButton = ({ type, current, onClick, label, icon }) => (
  <button
    onClick={() => onClick(type)}
    className={`sm:px-3 py-1 rounded-lg flex items-center gap-2 px-2 cursor-pointer ${
      current === type ? "bg-[#5a6e63] text-slate-100" : "bg-gray-100 hover:bg-gray-200"
    }`}
    aria-pressed={current === type}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const CustomerPerformanceChart = ({ customerId }) => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("bar");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dataType, setDataType] = useState("products"); 

  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900);
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [startDate, endDate] = dateRange;
        const timeRange = startDate && endDate ? `${startDate.toISOString()}_${endDate.toISOString()}` : undefined;

        const resp = await apiRequest.get(`/stats/customer/${customerId}`, {
          params: {
            period: timeRange ? undefined : timeFrame,
            timeRange,
            customerId,
          },
        });

        const items = Array.isArray(resp?.data?.data) ? resp.data.data : [];
        if (!mounted) return;
        setChartData(
          items.map((it) => ({
            ...it,
            date: it.date, 
          }))
        );
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err?.message || "Failed to load customer data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (customerId) fetchData();
    return () => {
      mounted = false;
    };
  }, [timeFrame, dateRange, customerId]);

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const isCustomRange = dateRange[0] && dateRange[1];

    if (isCustomRange) {
      return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const options = {
      daily: { month: 'short', day: 'numeric' },
      weekly: () => {
        const start = new Date(dateObj);
        const end = new Date(dateObj);
        end.setDate(start.getDate() + 6);
        return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      },
      monthly: { year: 'numeric', month: 'short' },
      yearly: { year: 'numeric' },
    };

    if (timeFrame === 'weekly') return options.weekly();
    return dateObj.toLocaleDateString('en-US', options[timeFrame]);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 text-slate-900">
          <div className="font-bold text-center text-lg mb-2 text-[#215f85]">
            {formatDate(row.date)}
          </div>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Products Purchased:</span> {row.productCount}
            </p>
            <p className="text-sm bg-purple-50 p-2 rounded">
              <span className="font-semibold">Orders Placed:</span> {row.orderCount}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const safeData = useMemo(() => {
    if (!Array.isArray(chartData)) return [];
    return chartData.map((d) => ({
      date: d.date,
      productCount: Number(d.productCount ?? d.products ?? 0),
      orderCount: Number(d.orderCount ?? d.orders ?? 0),
      ...d,
    }));
  }, [chartData]);

  const { chartWidth, barSize } = useMemo(() => {
    const points = safeData.length || 0;
    const minBarWidth = 48;
    const defaultGap = 8;
    if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth };

    const labelWidths = safeData.map((d) => {
      try {
        const label = String(formatDate(d.date));
        return Math.max(60, label.length * 8);
      } catch {
        return Math.max(60, String(d.date).length * 7);
      }
    });

    const totalLabelWidth = labelWidths.reduce((a, b) => a + b, 0);
    const totalGap = points > 1 ? (points - 1) * defaultGap : 0;
    let calculatedBarSize = minBarWidth;
    const totalRequiredWidth = totalLabelWidth + totalGap;

    if (totalRequiredWidth <= containerWidth) {
      const scale = (containerWidth - totalGap) / totalLabelWidth;
      calculatedBarSize = Math.max(minBarWidth, Math.min(minBarWidth + 10, Math.floor(minBarWidth * scale)));
    }

    return {
      chartWidth: Math.max(containerWidth, totalRequiredWidth + totalGap),
      barSize: calculatedBarSize,
    };
  }, [safeData, containerWidth, timeFrame, dateRange]);

  const isOverflowing = chartWidth > containerWidth;

  const tickEvery = useMemo(() => {
    const pts = safeData.length;
    if (pts <= 10) return 1;
    if (pts <= 20) return 1;
    if (pts <= 40) return 2;
    if (pts <= 80) return 4;
    return Math.ceil(pts / 40);
  }, [safeData.length]);

  const dataKey = dataType === "products" ? "productCount" : "orderCount";
  const yAxisFormatter = dataType === "products" ? (v) => `${v} units` : (v) => `${v} orders`;

  const chartProps = { data: safeData, margin: { top: 0, right: 20, left: 10, bottom: 1 } };

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[dataType][0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColors[dataType][1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              textAnchor="middle"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={yAxisFormatter} tick={{ fill: '#6b7280', fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span className="text-gray-600">{value}</span>} iconType="circle" />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColors[dataType][0]}
              strokeWidth={2}
              fill="url(#colorPerformance)"
              name={dataType === "products" ? "Products Purchased" : "Orders Placed"}
              isAnimationActive
              animationDuration={700}
            />
          </AreaChart>
        );
      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[dataType][0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColors[dataType][1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              textAnchor="middle"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={yAxisFormatter} tick={{ fill: '#6b7280', fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span className="text-gray-600">{value}</span>} iconType="circle" />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColors[dataType][0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[dataType][1], strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name={dataType === "products" ? "Products Purchased" : "Orders Placed"}
              isAnimationActive
              animationDuration={700}
            />
          </LineChart>
        );
      default:
        // BAR CHART: Add animated gradient defs and use them as the Bar fill
        const [c0, c1] = gradientColors[dataType] || ['#5F9A7D', '#10B981'];
        // create an id unique-ish to dataType to avoid collisions
        const gradId = `barGradient-${dataType}`;

        return (
          <BarChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              {/* Animated gradient for bars: each stop animates between the two colors */}
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c0}>
                  {/* animate stop-color between c0 -> c1 -> c0 */}
                  <animate attributeName="stop-color" values={`${c0};${c1};${c0}`} dur="4s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor={c1}>
                  {/* animate stop-color between c1 -> c0 -> c1 (opposite phase) */}
                  <animate attributeName="stop-color" values={`${c1};${c0};${c1}`} dur="4s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              textAnchor="middle"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={yAxisFormatter} tick={{ fill: '#6b7280', fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(value) => <span className="text-gray-600">{value}</span>} iconType="circle" />
            <Bar
              dataKey={dataKey}
              fill={`url(#${gradId})`}
              radius={[4, 4, 0, 0]}
              maxBarSize={barSize}
              name={dataType === "products" ? "Products Purchased" : "Orders Placed"}
              isAnimationActive
              animationDuration={700}
            >
              {safeData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  const selectTriggerClass =
    "border-gray-200 rounded-lg px-2 py-2 text-nowrap sm:text-sm bg-white shadow-sm w-48 md:w-52 flex justify-between items-center md:text-sm text-xs text-slate-700 font-medium cursor-pointer"

  return (
    <div ref={containerRef} className="bg-white rounded-xl sm:p-4 p-1 font-poppins h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 m-4">
        <h1 className="sm:text-xl text-lg font-semibold text-gray-800 text-nowrap flex items-center gap-2">
          <BsPersonLinesFill className="text-teal-800" />
          <span>Customer Purchase Activity</span>
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex gap-2 text-sm md:text-base bg-gray-100 p-1 text-slate-500 rounded-lg cursor-pointer">
            <ChartTypeButton type="bar" current={chartType} onClick={setChartType} label="Bars" icon={<RiBarChartGroupedLine />} />
            <ChartTypeButton type="line" current={chartType} onClick={setChartType} label="Line" icon={<FaChartLine />} />
            <ChartTypeButton type="area" current={chartType} onClick={setChartType} label="Area" icon={<FaChartArea />} />
          </div>

          <Select value={dataType} onValueChange={(v) => setDataType(v)}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Data Type" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem className="cursor-pointer"  value="products">Products Purchased</SelectItem>
                <SelectItem
                className="cursor-pointer"  value="orders">Orders Placed</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v)} >
            <SelectTrigger className={selectTriggerClass} disabled={dateRange[0] !== null}>
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem
                className="cursor-pointer"  value="daily">Daily</SelectItem>
                <SelectItem
                className="cursor-pointer"  value="weekly">Weekly</SelectItem>
                <SelectItem className="cursor-pointer" value="monthly">Monthly</SelectItem>
                <SelectItem className="cursor-pointer" value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            placeholderText="Custom Date Range"
            className="border border-gray-200 rounded-lg px-4 py-2 md:text-sm text-xs bg-white shadow-sm w-48 text-slate-800"
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
      ) : (!safeData || safeData.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No purchase data available</p>
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

export default CustomerPerformanceChart;
