import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";
import { useChartData } from "../../hooks/useChartData";
import { ErrorFallback, Loader } from "../ui/Loaders";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";
import { ScrollArea } from "../ui/ScrollArea";

const PerformanceChart = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const { data = [], loading, error } = useChartData(`/stats?period=${timeFrame}`, {}, [timeFrame]);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(700);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const formatXAxis = (tick) => {
    if (timeFrame === 'monthly') {
      const [year, month] = String(tick).split('-');
      if (!month) return tick;
      return new Date(year, month - 1).toLocaleString('default', { month: 'short' });
    }
    return tick;
  };

  
  const { chartWidth, barSize } = useMemo(() => {
    const points = data.length || 0;
    const maxBarWidth = 40;
    const minBarWidth = 38; // 1cm
    const maxGap = 20;
    const minGap = 5;

    if (points === 0) return { chartWidth: containerWidth, barSize: maxBarWidth };

    let barWidth = maxBarWidth;
    let gap = maxGap;
    let requiredWidth = points * barWidth + (points - 1) * gap;

    while (requiredWidth > containerWidth && barWidth > minBarWidth) {
      barWidth -= 1;
      gap = Math.max(minGap, Math.floor((containerWidth - points * barWidth) / (points - 1)));
      requiredWidth = points * barWidth + (points - 1) * gap;
    }

    const finalWidth = Math.max(containerWidth, requiredWidth);

    return { chartWidth: finalWidth, barSize: barWidth };
  }, [data, containerWidth]);

  return (
    <div ref={containerRef} className="bg-white rounded-lg p-4 h-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
        <h1 className="sm:text-lg text-base font-semibold text-left">
          {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Performance
        </h1>
        <div className="flex justify-end mt-2">
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm sm:w-44 w-32 flex items-center justify-between">
              <SelectValue placeholder="Select timeframe" />
              <ChevronDown className="h-4 w-4" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectGroup>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
    </div>

      {/* Error */}
      {error && <ErrorFallback message={error} />}

      {/* Loader */}
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="h-[450px]">
          <ScrollArea
            orientation="horizontal"
            className="h-full"
            style={{ scrollSnapType: "x mandatory" }}
          >
            <div
              style={{ minWidth: `${chartWidth}px`, height: "100%", display: "flex" }}
            >
              <BarChart
                data={data}
                width={chartWidth}
                height={400}
                margin={{ top: 20, right: 8, left: 2, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                <XAxis
                  dataKey="name"
                  tickFormatter={formatXAxis}
                  label={{
                    value:
                      timeFrame === 'daily'
                        ? 'Days'
                        : timeFrame === 'monthly'
                          ? 'Months'
                          : 'Years',
                    position: "bottom",
                    fill: "#6b7280",
                    fontSize: 12
                  }}
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.05)" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                  }}
                  itemStyle={{ color: "#1b8385", fontSize: 12 }} 
                />
                <Legend
                  align="right"
                  verticalAlign="top"
                  iconType="circle"
                  iconSize={10}
                  wrapperStyle={{ paddingBottom: 20 }}
                />

                <Bar
                  dataKey="Products"
                  name="New Products"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={barSize}
                  isAnimationActive={true}
                  fill="url(#productsGradient)"
                  onMouseEnter={(e) => e.target.setAttribute('fill', "#6aa6f2")}
                  onMouseLeave={(e) => e.target.setAttribute('fill', "url(#productsGradient)")}
                >
                  <LabelList dataKey="Products" position="top" fill="#4a90e2" fontSize={12} />
                </Bar>

                {/* Orders Bar */}
                <Bar
                  dataKey="Orders"
                  name="Total Orders"
                  radius={[4, 4, 0, 0]}
                  maxBarSize={barSize}
                  isAnimationActive={true}
                  fill="url(#ordersGradient)"
                  onMouseEnter={(e) => e.target.setAttribute('fill', "#8bbf8b")}
                  onMouseLeave={(e) => e.target.setAttribute('fill', "url(#ordersGradient)")}
                >
                  <LabelList dataKey="Orders" position="top" fill="#7ca97c" fontSize={12} />
                </Bar>

                <defs>
                  <linearGradient id="productsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4a90e2" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#4a90e2" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7ca97c" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#7ca97c" stopOpacity={0.6} />
                  </linearGradient>
                </defs>

              </BarChart>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default PerformanceChart;
