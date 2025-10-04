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
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";

const gradientColors = {
  top: ['#206783', '#4b4453'],
  least: ['#c34a36', '#ffc75f']
};


const barPalette = [
  ['#206783', '#4b4453'],
  ['#c34a36', '#ffc75f'],
  ['#206f50', '#34d399'],
  ['#2563eb', '#60a5fa'],
  ['#8b5cf6', '#c084fc'],
  ['#f97316', '#fb923c'],
  ['#ef4444', '#fda4af'],
  ['#0ea5a4', '#34d399'],
  ['#db2777', '#fb7185'],
  ['#15803d', '#34d399'],
];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const ProductRevenueTrends = () => {
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [performanceType, setPerformanceType] = useState("top");
  const [chartType, setChartType] = useState("bar");
  const [dateRange, setDateRange] = useState([null, null]);

  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    sort: performanceType === 'top' ? 'desc' : 'asc',
    timeRange: dateRange[0] && dateRange[1]
      ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
      : undefined,
  };

  const { data = [], loading, error } = useChartData("/stats/products-revenue-trends", params, [timeFrame, performanceType, dateRange]);

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
    return data.map((d) => {
      const name = d.productName ?? "Unknown Product";
      const short = typeof name === "string" && name.length > 20 ? name.slice(0, 18).trim() + "…" : name;
      return {
        productId: d.productId ?? d.id ?? null,
        productName: name,
        productNameShort: short,
        totalRevenue: Number(d.totalRevenue ?? 0),
        totalSold: Number(d.totalSold ?? d.totalSoldCount ?? 0),
        ...d,
      };
    });
  }, [data]);

  // compute chartWidth & barSize based on labels (same approach used in ProductsSoldChart)
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
          </div>
        </div>
      );
    }
    return null;
  };

  const chartProps = { data: safeData, margin: { top: 20, right: 10, left: 10, bottom: 0 } };
  const legendProps = { formatter: (value) => <span className="text-gray-600">{value}</span>, iconType: "circle", wrapperStyle: { marginTop: -8 } };

  const renderChart = () => {
    const gradId = `revenueGrad-${performanceType}`;

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={400}>
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
            <YAxis tickFormatter={(v) => `₹${v}`} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            <Area
              type="monotone"
              dataKey="totalRevenue"
              stroke={gradientColors[performanceType][0]}
              fill={`url(#${gradId})`}
              strokeWidth={2}
              isAnimationActive
              animationDuration={900}
              name="Total Revenue"
            />
          </AreaChart>
        );

      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={400}>
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
            <YAxis tickFormatter={(v) => `₹${v}`} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend {...legendProps} />
            <Line
              type="monotone"
              dataKey="totalRevenue"
              stroke={gradientColors[performanceType][0]}
              strokeWidth={2}
              dot={{ r: 4, fill: gradientColors[performanceType][1] }}
              activeDot={{ r: 8 }}
              isAnimationActive
              animationDuration={900}
              name="Total Revenue"
            />
          </LineChart>
        );

      default:
        // BAR: create a gradient per bar and use Cells to assign per-bar gradient fills
        return (
          <BarChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              {/* generate linearGradient per bar, cycling through barPalette */}
              {safeData.map((_, idx) => {
                const pair = barPalette[idx % barPalette.length];
                const id = `barGrad-${performanceType}-${idx}`;
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
            <YAxis tickFormatter={(v) => `₹${v}`} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="totalRevenue"
              radius={[4, 4, 0, 0]}
              maxBarSize={barSize}
              isAnimationActive
              animationDuration={900}
              name="Total Revenue"
            >
              {safeData.map((entry, idx) => {
                const id = `barGrad-${performanceType}-${idx}`;
                return <Cell key={`cell-${idx}`} fill={`url(#${id})`} />;
              })}
            </Bar>
          </BarChart>
        );
    }
  };

  const selectTriggerClass =
    "border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-36 md:w-44 text-nowrap flex justify-between items-center md:text-sm text-xs";

  return (
    <div ref={containerRef} className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm border border-gray-100">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="sm:text-xl text-lg font-bold text-gray-800 text-nowrap flex items-center gap-2">
          {performanceType === 'top' ? (
            <>
              <BsGraphUpArrow className="text-teal-800" />
              <span>Top Revenue Products</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Low Revenue Products</span>
            </>
          )}
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={performanceType} onValueChange={(value) => setPerformanceType(value)}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Performance Type" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white w-36 md:w-44">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="top">Top Performers</SelectItem>
                <SelectItem className="md:text-sm text-xs" value="least">Low Performers</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value)}>
            <SelectTrigger className={selectTriggerClass} disabled={dateRange[0] !== null}>
              <SelectValue placeholder="Time Frame" />
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
          <p className="text-gray-500 font-medium">No revenue data for selected period</p>
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

export default ProductRevenueTrends;
