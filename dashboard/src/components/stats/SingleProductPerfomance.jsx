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
import { BsBoxSeam } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";

const gradientColors = {
  revenue: ["#5F9A7D", "#10B981"],
  units: ["#065C71", "#EC4899"],
};


const ProductPerformanceChart = ({ productId }) => {
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
    productId,
  };

  const { data = [], loading, error } = useChartData(
    `/stats/product/${productId}/performance`,
    params,
    [timeFrame, dateRange, productId]
  );

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900);
  const [chartHeight, setChartHeight] = useState(400);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
      const containerH = containerRef.current?.offsetHeight ?? 700;
      const headerH = headerRef.current?.offsetHeight ?? 96;
      const available = Math.max(240, containerH - headerH - 48);
      setChartHeight(available);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const containerH = containerRef.current?.offsetHeight ?? 700;
    const headerH = headerRef.current?.offsetHeight ?? 96;
    const available = Math.max(240, containerH - headerH - 48);
    setChartHeight(available);
  }, [data, dateRange, containerWidth]);

  const productName = data && data.length > 0 && data[0].productName ? data[0].productName : "Product";

  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => ({
      date: d.date,
      totalRevenue: Number(d.totalRevenue ?? 0),
      totalSold: Number(d.totalSold ?? 0),
      ...d,
    }));
  }, [data]);

  const { chartWidth, barSize } = useMemo(() => {
    const points = safeData.length || 0;
    const minBarWidth = 38;
    const defaultGap = 2;
    if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth };

    const labelWidths = safeData.map((d) => {
      const label = String(d.date ?? d.label ?? "");
      return Math.max(60, Math.min(100, label.length * 7));
    });

    const totalLabelWidth = labelWidths.reduce((a, b) => a + b, 0);
    const totalGap = points > 1 ? (points - 1) * defaultGap : 0;
    const totalRequiredWidth = totalLabelWidth + totalGap;

    let calculatedBarSize = minBarWidth;
    if (totalRequiredWidth <= containerWidth) {
      const scale = (containerWidth - totalGap) / totalLabelWidth;
      calculatedBarSize = Math.max(minBarWidth, Math.min(minBarWidth + 10, Math.floor(minBarWidth * scale)));
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

  const formatDate = (date) => {
    const dateObj = new Date(date);
    const isCustomRange = dateRange[0] && dateRange[1];
    if (isCustomRange) {
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
    const options = {
      daily: { month: "short", day: "numeric" },
      weekly: () => {
        const s = new Date(dateObj);
        const e = new Date(dateObj);
        e.setDate(s.getDate() + 6);
        return `${s.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${e.toLocaleDateString(
          "en-US",
          { month: "short", day: "numeric" }
        )}`;
      },
      monthly: { year: "numeric", month: "short" },
      yearly: { year: "numeric" },
    };
    if (timeFrame === "weekly") return options.weekly();
    return dateObj.toLocaleDateString("en-US", options[timeFrame]);
  };

  const formatTooltipDate = (date) => {
    try {
      const d = new Date(date);
      return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return String(date ?? "");
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-lg mb-2 text-teal-700">{formatTooltipDate(d.date)}</div>
          <div className="grid gap-2">
            <p className="text-xs bg-blue-50 p-2 rounded">
              <span className="font-semibold">Revenue:</span> ₹{Number(d.totalRevenue ?? 0).toFixed(2)}
            </p>
            <p className="text-xs bg-teal-50 p-2 rounded">
              <span className="font-semibold">Units Sold:</span> {Number(d.totalSold ?? 0)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // shared chart props
  const chartProps = { data: safeData, margin: { top: 20, right: 10, left: 10, bottom: 0 } };
  const legendFormatter = (value) =>
    value === "totalRevenue" ? "Revenue" : value === "totalSold" ? "Units Sold" : value;

  const renderChart = () => {
    const dataKey = dataType === "revenue" ? "totalRevenue" : "totalSold";
    const yAxisFormatter = dataType === "revenue" ? (v) => `₹${v}` : (v) => `${v} units`;
    const gradId = `colorPerformance-${dataType}`;

    switch (chartType) {
      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={chartHeight}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[dataType][0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColors[dataType][1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={0}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              angle={0}
              textAnchor="middle"
            />
            <YAxis tickFormatter={yAxisFormatter} tick={{ fill: "#6b7280", fontSize: 12 }} width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span className="text-gray-600">{legendFormatter(v)}</span>} iconType="circle" />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColors[dataType][0]}
              strokeWidth={2}
              dot={{ fill: gradientColors[dataType][1], strokeWidth: 2 }}
              activeDot={{ r: 6 }}
              name={dataType === "revenue" ? "Revenue" : "Units Sold"}
            />
          </LineChart>
        );

      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={chartHeight}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[dataType][0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColors[dataType][1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={0}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              angle={0}
              textAnchor="middle"
            />
            <YAxis tickFormatter={yAxisFormatter} tick={{ fill: "#6b7280", fontSize: 12 }} width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span className="text-gray-600">{legendFormatter(v)}</span>} iconType="circle" />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={gradientColors[dataType][0]}
              strokeWidth={2}
              fill={`url(#${gradId})`}
              name={dataType === "revenue" ? "Revenue" : "Units Sold"}
            />
          </AreaChart>
        );

      default: // bar
        return (
          <BarChart {...chartProps} width={chartWidth} height={chartHeight}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientColors[dataType][0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={gradientColors[dataType][1]} stopOpacity={0.62} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              interval={0}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.date : null)).filter(Boolean)}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={60}
              angle={0}
              textAnchor="middle"
            />
            <YAxis tickFormatter={yAxisFormatter} tick={{ fill: "#6b7280", fontSize: 12 }} width={90} />
            <Tooltip content={<CustomTooltip />} />
            <Legend formatter={(v) => <span className="text-gray-600">{legendFormatter(v)}</span>} iconType="circle" />
            <Bar dataKey={dataKey} radius={[4, 4, 0, 0]} maxBarSize={barSize} fill={`url(#${gradId})`}>
              {safeData.map((_, idx) => (
                <Cell key={`cell-${idx}`} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  const selectTriggerClass =
    "border-gray-200 rounded-lg px-2 py-2 text-xs sm:text-sm bg-white shadow-sm w-36 md:w-44 flex justify-between items-center";

  return (
    <div ref={containerRef} className="bg-white rounded-xl sm:p-4 p-1 h-full flex flex-col shadow-sm border border-gray-100">
      <div ref={headerRef} className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="sm:text-xl text-lg font-bold text-gray-800 text-nowrap flex items-center gap-2">
          <BsBoxSeam className="text-teal-800" />
          <span>{productName} Performance</span>
        </h1>
        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={dataType} onValueChange={(value) => setDataType(value)}>
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 bg-white shadow-sm min-w-44 items-center text-nowrap flex flex-row text-xs sm:text-sm justify-between">
              <SelectValue placeholder="Data Type" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="units">Units Sold</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select
            value={timeFrame}
            onValueChange={(value) => setTimeFrame(value === "weekly" ? "daily" : value)}
          >
            <SelectTrigger
              className={selectTriggerClass}
              disabled={dateRange[0] !== null}
            >
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white w-36 md:w-44">
              <SelectGroup>
                <SelectItem value="daily">Daily</SelectItem>
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
            className="border border-gray-200 rounded-lg px-4 py-2 bg-white shadow-sm w-48 text-xs sm:text-sm"
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
      ) : (!safeData || safeData.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No product performance data available</p>
        </div>
      ) : (
        <div className="flex-1 h-full min-h-[320px] relative">
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

export default ProductPerformanceChart;
