import { useState, useMemo, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
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
  Cell,
} from "recharts";
import { useChartData } from "../../hooks/useChartData";
import { Loader, ErrorFallback } from "../ui/Loaders";
import ChartTypeSelector from "../ChartTypeSelector";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";

const gradientColors = {
  top: ["#227a63", "#4b4453"],
  least: ["#c34a36", "#ffc75f"],
};

const barPaletteSales = [
  ["#0f766e", "#34d399"],
  ["#0ea5e9", "#60a5fa"],
  ["#7c3aed", "#a78bfa"],
  ["#ef4444", "#fb7185"],
  ["#f97316", "#fb923c"],
  ["#059669", "#34d399"],
  ["#0ea5a4", "#5eead4"],
  ["#1d4ed8", "#60a5fa"],
  ["#b91c1c", "#fda4af"],
  ["#0b3d91", "#60a5fa"],
];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const ProductsSalesPerformanceChart = () => {
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [performanceType, setPerformanceType] = useState("top");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);

  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    sort: performanceType === "top" ? "desc" : "asc",
    timeRange:
      dateRange[0] && dateRange[1]
        ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
        : undefined,
  };

  const { data = [], loading, error } = useChartData("/stats/products-sales-performance", params, [
    timeFrame,
    performanceType,
    dateRange,
  ]);

  // container + responsive width + horizontal scroll behavior
  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900);
  const [chartHeight, setChartHeight] = useState(400);

  useEffect(() => {
    const updateSizes = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
      // compute available chart height: container height minus header controls height and some padding
      const containerH = containerRef.current?.offsetHeight ?? 700;
      const headerH = headerRef.current?.offsetHeight ?? 96;
      // leave 32 px padding + small buffer
      const available = Math.max(240, containerH - headerH - 48);
      setChartHeight(available);
    };

    updateSizes();
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  // Also update chartHeight when data or dateRange changes (layout can change)
  useEffect(() => {
    const containerH = containerRef.current?.offsetHeight ?? 700;
    const headerH = headerRef.current?.offsetHeight ?? 96;
    const available = Math.max(240, containerH - headerH - 48);
    setChartHeight(available);
  }, [data, dateRange, containerWidth]);

  const safeData = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((d) => {
      const name = d.productName ?? "Unknown Product";
      const short = typeof name === "string" && name.length > 20 ? name.slice(0, 18).trim() + "…" : name;
      return {
        productId: d.productId ?? d.id ?? null,
        productName: name,
        productNameShort: short,
        image: d.image ?? null,
        totalSold: Number(d.totalSold ?? d.totalSoldCount ?? 0),
        totalRevenue: Number(d.totalRevenue ?? 0),
        avgDailySales: Number(d.avgDailySales ?? 0),
        ...d,
      };
    });
  }, [data]);

  // compute chartWidth & barSize based on labels (same approach used previously)
  const { chartWidth, barSize } = useMemo(() => {
    const points = safeData.length || 0;
    const minBarWidth = 48;
    const defaultGap = 8;

    if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth };

    const minLabelWidth = 70;
    const labelWidths = safeData.map((d) => Math.max(minLabelWidth, String(d.productNameShort).length * 8));
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

  const formatXAxisLabel = (name) => {
    if (!name) return "";
    return typeof name === "string" && name.length > 20 ? name.slice(0, 18).trim() + "…" : name;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          {d.image && <img src={d.image} alt={d.productName} className="w-20 h-20 object-cover mb-3 mx-auto rounded-lg" />}
          <h3 className="font-bold text-center text-sm mb-2">{d.productName}</h3>
          <div className="grid gap-2">
            {d.productId && (
              <p className="text-xs bg-blue-50 p-2 rounded">
                <span className="font-semibold">SKU:</span> {d.productId}
              </p>
            )}
            <p className="text-xs bg-orange-50 p-2 rounded">
              <span className="font-semibold">Total Sold:</span> {d.totalSold}
            </p>
            <p className="text-xs bg-green-50 p-2 rounded">
              <span className="font-semibold">Revenue:</span> ₹{Number(d.totalRevenue ?? 0).toFixed(2)}
            </p>
            <p className="text-xs bg-purple-50 p-2 rounded">
              <span className="font-semibold">Avg. Daily Sales:</span> {Number(d.avgDailySales ?? 0).toFixed(1)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartProps = { data: safeData, margin: { top: 20, right: 10, left: 10, bottom: 0 } };

  const renderChart = () => {
    const gradId = `salesGrad-${performanceType}`;

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={chartHeight}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[performanceType][0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColors[performanceType][1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="productName"
              tickFormatter={formatXAxisLabel}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={80}
              textAnchor="end"
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.productName : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={(v) => `${v}`} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalSold"
              stroke={gradientColors[performanceType][0]}
              fill={`url(#${gradId})`}
              strokeWidth={2}
              isAnimationActive
              animationDuration={900}
              name="Units Sold"
            />
          </AreaChart>
        );

      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={chartHeight}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[performanceType][0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColors[performanceType][1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="productName"
              tickFormatter={formatXAxisLabel}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={80}
              textAnchor="end"
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.productName : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={(v) => `${v}`} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="totalSold"
              stroke={gradientColors[performanceType][0]}
              strokeWidth={2}
              dot={{ r: 4, fill: gradientColors[performanceType][1] }}
              activeDot={{ r: 8 }}
              isAnimationActive
              animationDuration={900}
              name="Units Sold"
            />
          </LineChart>
        );

      default:
        // BAR: create a gradient per bar and use Cells to assign per-bar gradient fills
        return (
          <BarChart {...chartProps} width={chartWidth} height={chartHeight}>
            <defs>
              {/* generate linearGradient per bar, cycling through barPaletteSales */}
              {safeData.map((_, idx) => {
                const pair = barPaletteSales[idx % barPaletteSales.length];
                const id = `barGrad-sales-${idx}`;
                return (
                  <linearGradient id={id} key={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={pair[0]} stopOpacity={0.98} />
                    <stop offset="100%" stopColor={pair[1]} stopOpacity={0.62} />
                  </linearGradient>
                );
              })}
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="productName"
              tickFormatter={formatXAxisLabel}
              interval={0}
              tick={{ fontSize: 12 }}
              tickLine={false}
              height={80}
              textAnchor="end"
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.productName : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={(v) => `${v}`} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="totalSold"
              radius={[4, 4, 0, 0]}
              maxBarSize={barSize}
              isAnimationActive
              animationDuration={900}
              name="Units Sold"
            >
              {safeData.map((entry, idx) => {
                const id = `barGrad-sales-${idx}`;
                return <Cell key={`cell-${idx}`} fill={`url(#${id})`} />;
              })}
            </Bar>
          </BarChart>
        );
    }
  };

  // consistent SelectTrigger class
  const selectTriggerClass =
    "border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 md:w-44 text-nowrap flex justify-between items-center";

  return (
    <div ref={containerRef} className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm border border-gray-100">
      {/* headerRef wraps the controls so we can measure its height */}
      <div ref={headerRef} className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="sm:text-xl text-lg font-bold text-gray-800 text-nowrap flex items-center gap-2">
          {performanceType === "top" ? (
            <>
              <BsGraphUpArrow className="text-teal-800" />
              <span>Top Selling Products</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Least Selling Products</span>
            </>
          )}
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={performanceType} onValueChange={setPerformanceType}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Select performance" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white w-36 md:w-44">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="top">
                  Top Performers
                </SelectItem>
                <SelectItem className="md:text-sm text-xs" value="least">
                  Low Performers
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className={selectTriggerClass} disabled={dateRange[0] !== null}>
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white w-36 md:w-44">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="daily">
                  Daily
                </SelectItem>
                <SelectItem className="md:text-sm text-xs" value="weekly">
                  Weekly
                </SelectItem>
                <SelectItem className="md:text-sm text-xs" value="monthly">
                  Monthly
                </SelectItem>
                <SelectItem className="md:text-sm text-xs" value="yearly">
                  Yearly
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            placeholderText="Custom Date Range"
            className="border border-gray-200 rounded-lg px-4 py-2 w-48 text-sm bg-white shadow-sm"
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
          <ErrorFallback message={error} />
        </div>
      ) : (!safeData || safeData.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No sales data for selected period</p>
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

export default ProductsSalesPerformanceChart;
