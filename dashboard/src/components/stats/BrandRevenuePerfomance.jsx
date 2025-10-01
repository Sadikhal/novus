
import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
} from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ChartTypeSelector from "../ChartTypeSelector"; 
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";
import { Loader } from "../ui/Loaders";
import { apiRequest } from "../../lib/apiRequest";

const gradientColors = {
  top: ["#326fa8", "#fff"],
  least: ["#c34a36", "#ffc75f"],
};

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const BrandRevenuePerformanceChart = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [performanceType, setPerformanceType] = useState("top");
  const [dateRange, setDateRange] = useState([null, null]);
  const [chartType, setChartType] = useState("bar");
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
        const timeRange = startDate && endDate ? `${startDate.toISOString()}_${endDate.toISOString()}` : undefined;

        const resp = await apiRequest.get("/stats/brands-revenue-performance", {
          params: {
            period: timeRange ? undefined : timeFrame,
            sort: performanceType === "top" ? "desc" : "asc",
            timeRange,
          },
        });

        setChartData(Array.isArray(resp.data) ? resp.data : resp.data?.data ?? []);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load brand performance data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeFrame, performanceType, dateRange]);

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
    return chartData.map((d) => ({
      brand: d.brand,
      logo: d.logo,
      totalRevenue: Number(d.totalRevenue ?? 0),
      ...d,
    }));
  }, [chartData]);

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

  const colorsForBrands = useMemo(() => {
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
      <linearGradient id={`brandRevGrad-${i}`} key={i} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={colorsForBrands[i]} stopOpacity={0.98} />
        <stop offset="100%" stopColor={colorsForBrands[i]} stopOpacity={0.62} />
      </linearGradient>
    ));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          {data?.image ? (
            <img src={data?.image[0]} alt={data.brand} className="w-20 h-20 object-contain mb-3 mx-auto rounded-lg" />
          ) : null}
          <h3 className="font-bold text-center text-lg mb-2">{data.brand}</h3>
          <div className="grid gap-2">
            <p className="text-sm bg-blue-50 p-2 rounded">
              <span className="font-semibold">Total Revenue:</span> ₹{data.totalRevenue?.toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderXAxisTick = ({ x, y, payload, index }) => {
    const color = colorsForBrands[index % colorsForBrands.length];
    return (
      <text x={x} y={y + 15} textAnchor="middle" fill={color} fontSize={12}>
        {payload.value}
      </text>
    );
  };

  const chartProps = { data: safeData, margin: { top: 20, right: 20, left: 10, bottom: 5 } };

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="brandRevAreaGrad" x1="0" y1="0" x2="0" y2="1">
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
              ticks={safeData.map((d, i) => (i % Math.max(1, Math.ceil(safeData.length / Math.min(40, safeData.length))) === 0 ? d.brand : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={(v) => `₹${v}`} width={80} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            <Area
              type="monotone"
              dataKey="totalRevenue"
              stroke={gradientColors[performanceType][0]}
              fill="url(#brandRevAreaGrad)"
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
              ticks={safeData.map((d, i) => (i % Math.max(1, Math.ceil(safeData.length / Math.min(40, safeData.length))) === 0 ? d.brand : null)).filter(Boolean)}
            />
            <YAxis tickFormatter={(v) => `₹${v}`} width={80} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            <Line
              type="monotone"
              dataKey="totalRevenue"
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
              tick={renderXAxisTick}
            />
            <YAxis tickFormatter={(v) => `₹${v}`} width={80} tick={{ fontSize: 14 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="totalRevenue" radius={[4, 4, 0, 0]} maxBarSize={barSize} isAnimationActive animationDuration={900}>
              {safeData.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={`url(#brandRevGrad-${idx})`} style={{ width: barSize }} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div ref={containerRef} className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm relative">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h2 className="sm:text-xl text-base font-bold text-gray-800 sm:text-nowrap items-start sm:items-center text-wrap flex gap-2">
          {performanceType === "top" ? (
            <>
              <BsGraphUpArrow className="text-teal-800 pt-1 sm:pt-0" />
              <span>Top Revenue Performing Brands</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Least Performing Brands</span>
            </>
          )}
        </h2>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={performanceType} onValueChange={setPerformanceType}>
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 md:text-sm text-xs bg-white shadow-sm w-36 md:w-44 flex justify-between items-center text-nowrap">
              <SelectValue placeholder="Top or Least" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white shadow-sm w-36 md:w-44 ">
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
            <SelectTrigger
              className="border-gray-200 rounded-lg px-2 py-2  md:text-sm text-xs bg-white shadow-sm w-36 md:w-44  flex justify-between items-center"
              disabled={dateRange[0] !== null}
            >
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white  w-36 md:w-44 ">
              <SelectGroup>
                <SelectItem className="md:text-sm text-xs" value="daily">
                  Last 30 Days
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
          <span className="material-icons text-red-500 text-4xl mb-4">error</span>
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      ) : !safeData || safeData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No revenue data for selected period</p>
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

export default BrandRevenuePerformanceChart;
