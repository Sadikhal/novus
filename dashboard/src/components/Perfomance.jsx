import { PieChart, Pie, ResponsiveContainer } from "recharts";

const Performance = ({ rating }) => {
  const chartData = [
    { name: "Current Rating", value: rating, fill: "#C3EBFA" },
    { name: "Remaining", value: 5 - rating, fill: "#FAE27C" },
  ];

  return (
    <div className="bg-white w-full  p-4 rounded-md h-80 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Brand Performance</h1>
        <img src="/images/moreDark.png" alt="" width={16} height={16} />
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            dataKey="value"
            startAngle={180}
            endAngle={0}
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={2}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-3xl font-bold">{rating?.toFixed(1) || '0.0'}</h1>
        <p className="text-xs text-gray-300">out of 5 stars</p>
      </div>
      <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
        Average Product Rating
      </h2>
    </div>
  );
};

export default Performance;