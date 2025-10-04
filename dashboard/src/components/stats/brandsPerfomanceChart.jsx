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
  Cell,
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
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";

const gradientColors = {
  top: ["#2c4a3b", "#88c2a9"],
  least: ["#6b2737", "#e88d7d"],
};

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const BrandsPerformance = () => {
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [performanceType, setPerformanceType] = useState("top");
  const [chartType, setChartType] = useState("area");
  const [dateRange, setDateRange] = useState([null, null]);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900);

  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    sort: performanceType === "top" ? "desc" : "asc",
    timeRange:
      dateRange[0] && dateRange[1]
        ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
        : undefined,
  };

  const { data = [], loading, error } = useChartData(
    "/stats/brands-performance",
    params,
    [timeFrame, performanceType, dateRange]
  );

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
      brand: d.brand,
      totalSold: Number(d.totalSold ?? 0),
      activeDays: Number(d.activeDays ?? 0),
      avgDailySales: Number(d.avgDailySales ?? 0),
    }));
  }, [data]);

  const { chartWidth, barSize, gaps } = useMemo(() => {
    const points = safeData.length || 0;
    const minBarWidth = 38; 
    const defaultGap = 8;

    if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth, gaps: defaultGap };

    const labelWidths = safeData.map((d) => Math.max(50, d.brand.length * 7));
    const totalLabelWidth = labelWidths.reduce((a, b) => a + b, 0);
    const totalGap = points > 1 ? (points - 1) * defaultGap : 0;

    let calculatedBarSize = minBarWidth;
    let calculatedGaps = labelWidths.map((w) => (w - minBarWidth) / 2);

    const totalRequiredWidth = totalLabelWidth + totalGap;

    if (totalRequiredWidth <= containerWidth) {
      const scale = (containerWidth - totalGap) / totalLabelWidth;
      calculatedBarSize = Math.max(minBarWidth, Math.min(minBarWidth + 10, minBarWidth * scale));
    }

    return {
      chartWidth: Math.max(containerWidth, totalRequiredWidth + totalGap),
      barSize: calculatedBarSize,
      gaps: calculatedGaps,
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

  const colorsForBars = useMemo(() => {
    const n = Math.max(1, safeData.length);
    const step = 137.5;
    let h = 10;
    return Array.from({ length: n }).map((_, i) => {
      h = (h + step) % 360;
      return `hsl(${Math.round(h)}, 60%, 48%)`;
    });
  }, [safeData.length]);

  const barGradientsDefs = () =>
    safeData.map((_, i) => (
      <linearGradient id={`brandGrad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colorsForBars[i]} stopOpacity={0.98} />
        <stop offset="100%" stopColor={colorsForBars[i]} stopOpacity={0.62} />
      </linearGradient>
    ));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <h3 className="font-bold text-center text-lg mb-2">{d.brand}</h3>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Total Sold:</span> {d.totalSold}
            </p>
            <p className="text-sm bg-green-50 p-2 rounded">
              <span className="font-semibold">Active Days:</span> {d.activeDays}
            </p>
            <p className="text-sm bg-purple-50 p-2 rounded">
              <span className="font-semibold">Avg. Daily Sales:</span> {d.avgDailySales?.toFixed(1)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const chartProps = { data: safeData, margin: { top: 20, right: 20, left: 10, bottom: 5 } };

    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="brandAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientColors[performanceType][0]} stopOpacity={0.8} />
                <stop offset="95%" stopColor={gradientColors[performanceType][1]} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="brand"
              angle={0}
              textAnchor="middle"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.brand : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={(v) => `${v} units`} width={60} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />
               <Legend iconType="circle" />           
            <Area
              type="monotone"
              dataKey="totalSold"
              stroke={gradientColors[performanceType][0]}
              fill="url(#brandAreaGrad)"
              fillOpacity={1}
              strokeWidth={2}
              isAnimationActive
              animationDuration={900}
            />
          </AreaChart>
        );

      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={400}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="brand"
              angle={0}
              textAnchor="middle"
              tick={{ fontSize: 12 }}
              interval={0}
              tickLine={false}
              height={60}
              ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.brand : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={(v) => `${v} units`} width={60} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circe" />
            <Line
              type="monotone"
              dataKey="totalSold"
              stroke={gradientColors[performanceType][0]}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 8 }}
              isAnimationActive
              animationDuration={900}
            />
          </LineChart>
        );

      default:
        return (
          <BarChart {...chartProps} width={chartWidth} height={400}>
            <defs>{barGradientsDefs()}</defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="brand"
              angle={0}
              textAnchor="middle"
              interval={0}
              tickLine={false}
              height={60}
              tick={({ x, y, payload, index }) => {
                const color = colorsForBars[index % colorsForBars.length];
                return (
                  <text x={x} y={y + 15} textAnchor="middle" fill={color} fontSize={12}>
                    {payload.value}
                  </text>
                );
              }}
            />
            <YAxis tickFormatter={(v) => `${v} units`} width={60} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />            
            <Bar dataKey="totalSold" radius={[4, 4, 0, 0]} maxBarSize={barSize} isAnimationActive animationDuration={900}>
              {safeData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={`url(#brandGrad-${idx})`} style={{ width: barSize }} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div ref={containerRef} className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm relative">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="sm:text-xl text-lg font-bold text-gray-800 flex items-center gap-2">
          {performanceType === "top" ? (
            <>
              <BsGraphUpArrow className="text-teal-800" />
              <span>Top Performing Brands</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Least Performing Brands</span>
            </>
          )}
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={performanceType} onValueChange={setPerformanceType}>
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 md:text-sm text-xs bg-white shadow-sm w-36 md:w-44 flex justify-between items-center text-nowrap">
              <SelectValue placeholder="Top or Least" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-sm w-36 md:w-44 ">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="top">Top Performers</SelectItem>
                <SelectItem className="md:text-sm text-xs" value="least">Low Performers</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger
              className="border-gray-200 rounded-lg px-2 py-2  md:text-sm text-xs bg-white shadow-sm w-36 md:w-44  flex justify-between items-center"
              disabled={dateRange[0] !== null}
            >
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white  w-36 md:w-44 ">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="daily">Today</SelectItem>
                <SelectItem  className="md:text-sm text-xs"  value="weekly">Weekly</SelectItem>
                <SelectItem  className="md:text-sm text-xs"  value="monthly">Monthly</SelectItem>
                <SelectItem  className="md:text-sm text-xs"  value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            placeholderText="Custom Date Range"
            className="border border-gray-200 rounded-lg px-3 py-2  w-36 md:w-48 text-xs md:text-sm  bg-white shadow-sm "
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
          <p className="text-gray-500 font-medium">No brand performance data</p>
        </div>
      ) : (
        <div className="flex-1 h-full min-h-[400px] relative">
          {isOverflowing && (
            <>
              <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-10 bg-gradient-to-r from-white via-white/60 to-transparent" />
              <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-10 bg-gradient-to-l from-white via-white/60 to-transparent" />
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

export default BrandsPerformance;
