import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useChartData } from "../../hooks/useChartData";
import { ErrorFallback, Loader } from "../ui/Loaders";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
import { ChevronDown } from "lucide-react";

const PerformanceChart = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  const { data, loading, error } = useChartData(`/stats?period=${timeFrame}`, {}, [timeFrame]);

  const formatXAxis = (tick) => {
    if (timeFrame === 'monthly') {
      const [year, month] = tick.split('-');
      return new Date(year, month-1).toLocaleString('default', { month: 'short' });
    }
    return tick;
  };

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">
          {timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)} Performance
        </h1>
        <Select
          value={timeFrame}
          onValueChange={(value) => setTimeFrame(value)}
        >
          <SelectTrigger 
            className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 items-center text-nowrap flex flex-row justify-between"
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
      </div>

      {error && <ErrorFallback message={error} />}
      
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
            <XAxis
              dataKey="name"
              tickFormatter={formatXAxis}
              label={{ 
                value: timeFrame === 'daily' ? 'Days' : timeFrame === 'monthly' ? 'Months' : 'Years',
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
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}
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
              fill="#4a90e2"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="Orders"
              name="Total Orders"
              fill="#7ca97c"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PerformanceChart;