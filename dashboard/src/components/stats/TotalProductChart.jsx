
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
import { useChartData } from "../../hooks/useChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorFallback, Loader } from "../ui/Loaders";
import ChartTypeSelector from "../ChartTypeSelector";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphUpArrow } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";

const gradientColors = ['#206783', '#4d8076'];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const ProductsSoldChart = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);

  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    timeRange:
      dateRange[0] && dateRange[1]
        ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
        : undefined,
  };

  const { data = [], loading, error } = useChartData("/stats/orders", params, [timeFrame, dateRange]);

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

  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({
      date: d.date,
      totalSold: Number(d.totalSold ?? d.totalSoldCount ?? 0),
      ...d,
    }));
  }, [data]);

  const { chartWidth, barSize } = useMemo(() => {
    const points = safeData.length || 0;
    const minBarWidth = 48;
    const defaultGap = 8;

    if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth };

    const formatDateLabel = (date) => {
      try {
        const dateObj = new Date(date);
        const isCustomRange = dateRange[0] && dateRange[1];
        if (isCustomRange) {
          return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
        if (timeFrame === 'weekly') {
          const start = new Date(dateObj);
          const end = new Date(dateObj);
          end.setDate(start.getDate() + 6);
          return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        }
        if (timeFrame === 'monthly') {
          return dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        }
        if (timeFrame === 'yearly') {
          return dateObj.toLocaleDateString('en-US', { year: 'numeric' });
        }
        return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } catch {
        return String(date ?? "").slice(0, 12);
      }
    };

    const labelWidths = safeData.map((d) => {
      const label = formatDateLabel(d.date);
      return Math.max(60, label.length * 8);
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

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const isCustomRange = dateRange[0] && dateRange[1];

    if (isCustomRange) {
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }

    if (timeFrame === "weekly") {
      const start = new Date(dateObj);
      const end = new Date(dateObj);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
    }

    if (timeFrame === "monthly") {
      return dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short" });
    }

    if (timeFrame === "yearly") {
      return dateObj.toLocaleDateString("en-US", { year: "numeric" });
    }

    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTooltipDate = (date) => {
    try {
      const dateObj = new Date(date);
      if (timeFrame === "weekly") {
        const start = new Date(dateObj);
        const end = new Date(dateObj);
        end.setDate(start.getDate() + 6);
        const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const year = start.getFullYear();
        return `${startLabel} - ${endLabel}, ${year}`;
      }
      return dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return String(date ?? "");
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-lg mb-2 text-[#268358]">{formatTooltipDate(d.date)}</div>
          <div className="grid gap-2">
            <p className="text-sm bg-green-50 p-2 rounded">
              <span className="font-semibold">Total Sold:</span> {d.totalSold}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartProps = { data: safeData, margin: { top: 20, right: 20, left: 10, bottom: 0 } };
  const legendProps = { formatter: (value) => <span className="text-gray-600">{value}</span>, iconType: "circle", wrapperStyle: { marginTop: -8 } };

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="colorSold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={gradientColors[1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
              textAnchor="middle"
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            <Area type="monotone" dataKey="totalSold" stroke={gradientColors[0]} strokeWidth={2} fill="url(#colorSold)" name="Products Sold" />
          </AreaChart>
        );

      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="colorSoldLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[0]} stopOpacity={0.9} />
                <stop offset="95%" stopColor={gradientColors[1]} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
              textAnchor="middle"
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            <Line
              type="monotone"
              dataKey="totalSold"
              stroke={gradientColors[0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[1], strokeWidth: 2 }}
              activeDot={{ r: 8 }}
              name="Products Sold"
            />
          </LineChart>
        );

      default:
        return (
          <BarChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="colorSoldBar" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors[0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={gradientColors[1]} stopOpacity={0.62} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
              textAnchor="middle"
            />
            <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            <Bar dataKey="totalSold" radius={[4, 4, 0, 0]} maxBarSize={barSize} name="Products Sold" fill="url(#colorSoldBar)">
              {safeData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  // consistent SelectTrigger class from ProfitChart
  const selectTriggerClass =
    "border-gray-200 rounded-lg px-2 py-2 sm:text-sm bg-white shadow-sm w-36 md:w-44 flex justify-between items-center md:text-sm text-xs";

  return (
    <div ref={containerRef} className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="sm:text-xl text-lg font-bold text-gray-800 text-nowrap flex items-center gap-2">
          <BsGraphUpArrow className="text-teal-800" />
          <span>Products Sales Trend</span>
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value)}>
            <SelectTrigger className={selectTriggerClass} disabled={dateRange[0] !== null}>
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white w-36 md:w-44">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="daily">Daily</SelectItem>
                <SelectItem className="md:text-sm text-xs" value="weekly">Weekly</SelectItem>
                <SelectItem className="md:text-sm text-xs" value="monthly">Monthly</SelectItem>
                <SelectItem className="md:text-sm text-xs" value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            placeholderText="Custom Date Range"
            className="border border-gray-200 rounded-lg px-4 py-2 w-36 md:w-48 text-xs bg-white shadow-sm"
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
          <p className="text-gray-500 font-medium">No sales data for selected period</p>
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

export default ProductsSoldChart;
