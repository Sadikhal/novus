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
} from "recharts";
import { useChartData } from "../../hooks/useChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorFallback } from "../ui/Loaders";
import ChartTypeSelector from "../ChartTypeSelector";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphUpArrow } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";
import { useState,useRef,useEffect,useMemo } from "react";

const profitGradient = ["#8aa9cc", "#095ab5"];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const BrandPerformanceChart = ({ brandId }) => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dataType, setDataType] = useState("revenue");

  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    timeRange:
      dateRange[0] && dateRange[1]
        ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
        : undefined,
  };

  const { data = [], loading, error } = useChartData(`/stats/performance/${brandId}`, params, [
    timeFrame,
    dateRange,
  ]);

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

  // Helper: compute Monday (ISO-week start) for given ISO week (year, week)
  const isoWeekStart = (year, week) => {
    const jan4 = new Date(Date.UTC(year, 0, 4));
    const jan4Dow = jan4.getUTCDay() === 0 ? 7 : jan4.getUTCDay();
    const mondayOfWeek1 = new Date(jan4);
    mondayOfWeek1.setUTCDate(jan4.getUTCDate() - (jan4Dow - 1));
    const target = new Date(mondayOfWeek1);
    target.setUTCDate(mondayOfWeek1.getUTCDate() + (week - 1) * 7);
    target.setUTCHours(0, 0, 0, 0);
    return target;
  };

  // Robust date parser/normalizer — support "YYYY-WW" / "YYYY-##" week keys
  const parseDateValue = (val) => {
    if (val === null || val === undefined) return { valid: false, date: null, iso: "" };
    try {
      if (val instanceof Date) {
        if (!isNaN(val.getTime())) return { valid: true, date: val, iso: val.toISOString() };
        return { valid: false, date: null, iso: "" };
      }

      if (typeof val === "string") {
        const yyww = val.trim();
        const isoWeekMatch = yyww.match(/^(\d{4})-(\d{1,2})$/);
        if (isoWeekMatch) {
          const year = Number(isoWeekMatch[1]);
          const week = Number(isoWeekMatch[2]);
          if (!isNaN(year) && !isNaN(week) && week >= 1 && week <= 53) {
            const monday = isoWeekStart(year, week);
            return { valid: true, date: monday, iso: monday.toISOString(), _isWeekKey: true };
          }
        }
      }

      if (typeof val === "number") {
        const asMs = String(val).length === 10 ? val * 1000 : val;
        const d = new Date(asMs);
        if (!isNaN(d.getTime())) return { valid: true, date: d, iso: d.toISOString() };
      }

      if (typeof val === "string") {
        const d1 = new Date(val);
        if (!isNaN(d1.getTime())) return { valid: true, date: d1, iso: d1.toISOString() };
        const num = Number(val);
        if (!isNaN(num)) {
          const asMs = String(val).length === 10 ? num * 1000 : num;
          const d2 = new Date(asMs);
          if (!isNaN(d2.getTime())) return { valid: true, date: d2, iso: d2.toISOString() };
        }
      }
    } catch (e) {
    }
    return { valid: false, date: null, iso: String(val ?? "") };
  };

  const getWeekRange = (dateObj) => {
    const d = new Date(dateObj);
    const offset = (d.getDay() + 6) % 7;
    const start = new Date(d);
    start.setDate(d.getDate() - offset);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
  };

  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => {
      const parsed = parseDateValue(d.date);
      return {
        date: parsed.valid ? parsed.iso : d.date,
        rawDate: d.date,
        _isWeekKey: parsed._isWeekKey || false,
        totalRevenue: Number(d.totalRevenue ?? 0),
        totalProductsSold: Number(d.totalProductsSold ?? 0),
        ...d,
      };
    });
  }, [data]);

  const { chartWidth, barSize } = useMemo(() => {
    const points = safeData.length || 0;
    const minBarWidth = 38;
    const defaultGap = 8;

    if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth };

    const labelWidths = safeData.map((d) => Math.max(50, String(d.date).length * 7));
    const totalLabelWidth = labelWidths.reduce((a, b) => a + b, 0);
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

  const tickEvery = useMemo(() => {
    const pts = safeData.length;
    if (pts <= 10) return 1;
    if (pts <= 20) return 1;
    if (pts <= 40) return 2;
    if (pts <= 80) return 4;
    return Math.ceil(pts / 40);
  }, [safeData.length]);

  const formatXAxisLabel = (dateStr) => {
    const parsed = parseDateValue(dateStr);
    if (!parsed.valid) {
      return typeof dateStr === "string" ? String(dateStr).slice(0, 10) : "";
    }

    const d = parsed.date;
    if (timeFrame === "weekly") {
      const { start, end } = getWeekRange(d);
      const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      return `${startLabel} - ${endLabel}`;
    }

    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      const parsed = parseDateValue(row.date ?? row.rawDate);

      let formattedDate = "";
      if (!parsed.valid) {
        formattedDate = String(row.date ?? row.rawDate ?? "");
      } else {
        const d = parsed.date;
        if (timeFrame === "weekly") {
          const { start, end } = getWeekRange(d);
          const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const year = start.getFullYear();
          formattedDate = `${startLabel} - ${endLabel}, ${year}`;
        } else {
          formattedDate = d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        }
      }

      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-base mb-2 text-[#02638c]">{formattedDate}</div>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Revenue:</span> ₹{Number(row.totalRevenue ?? 0).toFixed(2)}
            </p>
            <p className="text-sm bg-green-50 p-2 rounded">
              <span className="font-semibold">Products Sold:</span> {row.totalProductsSold ?? 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartProps = { data: safeData, margin: { top: 30, right: 20, left: 10, bottom: 1 } };
  const dataKey = dataType === "revenue" ? "totalRevenue" : "totalProductsSold";
  const yAxisFormatter = (v) => (dataType === "revenue" ? `₹${v}` : `${v} units`);

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="singleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={profitGradient[0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={profitGradient[1]} stopOpacity={0.62} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              angle={0}
              textAnchor="middle"
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={yAxisFormatter} width={80} tick={{ fontSize: 12 }} />
            <Legend iconType="circle" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={profitGradient[0]}
              fill="url(#singleGrad)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={900}
            />
          </AreaChart>
        );

      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="singleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={profitGradient[0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={profitGradient[1]} stopOpacity={0.62} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              angle={0}
              textAnchor="middle"
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={yAxisFormatter} width={80} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={profitGradient[0]}
              strokeWidth={2}
              dot={{ r: 4, fill: profitGradient[1] }}
              activeDot={{ r: 8 }}
              isAnimationActive
              animationDuration={900}
            />
          </LineChart>
        );

      default:
        return (
          <BarChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="singleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={profitGradient[0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={profitGradient[1]} stopOpacity={0.62} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatXAxisLabel}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              angle={0}
              textAnchor="middle"
            />
            <YAxis tickFormatter={yAxisFormatter} width={80} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} maxBarSize={barSize} fill="url(#singleGrad)" isAnimationActive animationDuration={900} />
          </BarChart>
        );
    }
  };

  const selectTriggerClass =
    "border-gray-200 rounded-lg px-2 py-2 sm:text-sm bg-white shadow-sm w-36 md:w-44 flex justify-between items-center md:text-sm text-xs";

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-md border border-gray-100">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BsGraphUpArrow className="text-teal-800" />
          <span>Brand Performance</span>
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={dataType} onValueChange={(v) => setDataType(v)}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Data Type" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white w-36 md:w-44">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="revenue">Revenue</SelectItem>
                <SelectItem className="md:text-sm text-xs" value="products">Products Sold</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v)}>
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
      ) : !safeData || safeData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No performance data available</p>
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

export default BrandPerformanceChart;
