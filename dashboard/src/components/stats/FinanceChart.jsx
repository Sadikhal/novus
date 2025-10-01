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
} from "recharts";
import { useChartData } from "../../hooks/useChartData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ErrorFallback, Loader } from "../ui/Loaders";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/Select";
import { ChevronDown } from "lucide-react";
import ChartTypeSelector from "../ChartTypeSelector";
import { ScrollArea } from "../ui/ScrollArea";

const FinancialChart = () => {
  const [timeFrame, setTimeFrame] = useState("daily");
  const [chartType, setChartType] = useState("area"); 
  const [dateRange, setDateRange] = useState([null, null]);

  const containerRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(900);

  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    timeRange:
      dateRange[0] && dateRange[1]
        ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
        : undefined,
  };

  const { data = [], loading, error } = useChartData(
    "/stats/revenue",
    params,
    [timeFrame, dateRange]
  );

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const { chartWidth, barSize } = useMemo(() => {
    const points = data.length || 0;
    const maxBarWidth = 40;
    const minBarWidth = 38; 
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

  const formatDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);
    const isCustomRange = dateRange[0] && dateRange[1];
    if (isCustomRange) {
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }

    if (timeFrame === "weekly") {
      const start = new Date(dateObj);
      const end = new Date(dateObj);
      end.setDate(start.getDate() + 6);
      return `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric" }
      )}`;
    }

    
    if (timeFrame === "daily") {
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }); 
    }
    if (timeFrame === "monthly") {
      return dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" }); 
    }
    return dateObj.toLocaleDateString("en-US", { year: "numeric" }); 
  };

  const formatTooltipDate = (date) => {
    if (!date) return "";
    const dateObj = new Date(date);

    const isCustomRange = dateRange[0] && dateRange[1];
    if (isCustomRange) {
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    if (timeFrame === "weekly") {
      const start = new Date(dateObj);
      const end = new Date(dateObj);
      end.setDate(start.getDate() + 6);

      const startYear = start.getFullYear();
      const endYear = end.getFullYear();

      const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const endStr = end.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      if (startYear === endYear) {
        return `${startStr} - ${endStr}, ${startYear}`;
      }
      return `${startStr}, ${startYear} - ${endStr}, ${endYear}`;
    }

    if (timeFrame === "daily") {
      return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    if (timeFrame === "monthly") {
      return dateObj.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
    return dateObj.toLocaleDateString("en-US", { year: "numeric" });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      const profit = (d.revenue ?? 0) - (d.expenditure ?? 0);
      return (
        <div className="bg-white p-3 rounded-lg shadow border border-gray-200">
          <div className="font-semibold text-sm mb-2">{formatTooltipDate(d.date)}</div>
          <div className="text-sm grid gap-1">
            <div className="flex justify-between">
              <span className="font-medium">Revenue</span>
              <span>₹{(d.revenue ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Expenditure</span>
              <span>₹{(d.expenditure ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Profit</span>
              <span>₹{profit.toFixed(2)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const colors = {
      revenue: "#2f855a",
      expenditure: "#c05621",
    };

    if (chartType === "area") {
      return (
        <AreaChart data={data} width={chartWidth} height={400}>
          <defs>
            <linearGradient id="revAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.revenue} stopOpacity={0.35} />
              <stop offset="95%" stopColor={colors.revenue} stopOpacity={0.08} />
            </linearGradient>
            <linearGradient id="expAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors.expenditure} stopOpacity={0.35} />
              <stop offset="95%" stopColor={colors.expenditure} stopOpacity={0.08} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            angle={0} 
            textAnchor="middle"
            tick={{ fontSize: 12 }}
            interval={0}
            tickLine={false}
            height={60}
          />
          <YAxis tickFormatter={(v) => `₹${v}`}  tick={{ fill: "#6b7280", fontSize: 12 }} width={70} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={colors.revenue}
            strokeWidth={2}
            fill="url(#revAreaGrad)"
            name="Revenue"
            isAnimationActive={true}
            animationDuration={900}
            animationEasing="ease"
          />
          <Area
            type="monotone"
            dataKey="expenditure"
            stroke={colors.expenditure}
            strokeWidth={2}
            fill="url(#expAreaGrad)"
            name="Expenditure"
            isAnimationActive={true}
            animationDuration={900}
            animationEasing="ease"
          />
        </AreaChart>
      );
    }

    if (chartType === "line") {
      return (
        <LineChart data={data} width={chartWidth} height={400}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            angle={0}
            textAnchor="middle"
            tick={{ fontSize: 12 }}
            interval={0}
            tickLine={false}
            height={60}
          />
          <YAxis tickFormatter={(v) => `₹${v}`}  tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} width={70} />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke={colors.revenue}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Revenue"
            isAnimationActive={true}
            animationDuration={900}
            animationEasing="ease"
          />
          <Line
            type="monotone"
            dataKey="expenditure"
            stroke={colors.expenditure}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
            name="Expenditure"
            isAnimationActive={true}
            animationDuration={900}
            animationEasing="ease"
          />
        </LineChart>
      );
    }

    // default 'bar'
    return (
      <BarChart
        data={data}
        width={chartWidth}
        height={400}
        margin={{ top: 20, right: 12, left: 4, bottom: 10 }}
      >
        <defs>
          <linearGradient id="revBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.revenue} stopOpacity={0.95} />
            <stop offset="100%" stopColor={colors.revenue} stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="expBarGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.expenditure} stopOpacity={0.95} />
            <stop offset="100%" stopColor={colors.expenditure} stopOpacity={0.6} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          angle={0} // horizontal
          textAnchor="middle"
          tick={{ fontSize: 12 }}
          interval={0}
          tickLine={false}
          height={60}
        />
        <YAxis tickFormatter={(v) => `₹${v}`}  tick={{ fill: "#6b7280", fontSize: 12 }} tickLine={false} width={70} />
        <Tooltip content={<CustomTooltip />} wrapperStyle={{ borderRadius: 8 }} />
        <Legend iconType="circle" />

        <Bar
          dataKey="revenue"
          name="Revenue"
          radius={[6, 6, 0, 0]}
          maxBarSize={barSize}
          isAnimationActive={true}
          animationDuration={900}
          animationEasing="ease"
          fill="url(#revBarGrad)"
        />
        <Bar
          dataKey="expenditure"
          name="Expenditure"
          radius={[6, 6, 0, 0]}
          maxBarSize={barSize}
          isAnimationActive={true}
          animationDuration={900}
          animationEasing="ease"
          fill="url(#expBarGrad)"
        />
      </BarChart>
    );
  };

  return (
    <div ref={containerRef} className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800">Financial Overview</h1>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value)}>
            <SelectTrigger
              className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 flex justify-between items-center"
              disabled={dateRange[0] !== null}
            >
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

          <DatePicker
            selectsRange
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={setDateRange}
            placeholderText="Custom Date Range"
            className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm w-48"
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
      ) : data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <p className="text-gray-500 font-medium">No financial data available</p>
        </div>
      ) : (
        <div className="flex-1 h-full min-h-[400px]">
          <ScrollArea orientation="horizontal" className="h-full">
            <div style={{ minWidth: `${chartWidth}px`, height: "100%" }}>{renderChart()}</div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default FinancialChart;
