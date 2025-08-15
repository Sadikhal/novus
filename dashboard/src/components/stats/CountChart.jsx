import { useState, useEffect } from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer } from "recharts";
import { useChartData } from "../../hooks/useChartData";
import { FaPerson, FaPersonCircleCheck } from "react-icons/fa6";
import { ErrorFallback, Loader } from "../ui/Loaders";

const CountChart = () => {
  const { data, loading, error } = useChartData("/stats/users");
  const { totalSellers = 0, totalCustomers = 0 } = data;
  
  const chartData = [
    { name: "Total", count: totalSellers + totalCustomers, fill: "white" },
    { name: "Sellers", count: totalSellers, fill: "#9cafa4" },
    { name: "Customers", count: totalCustomers, fill: "#679397" },
  ];

  return (
    <div className="bg-white rounded-xl w-full h-full p-4 pb-16">
      {loading ? (
        <Loader/>
      ) : error ? (
        <ErrorFallback message={error}/>
      ): (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">Customers And Sellers</h1>
            <img src="/images/moreDark.png" alt="options" width={20} height={20} />
          </div>
          
          <div className="relative w-full h-[75%]">
            <ResponsiveContainer>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="100%"
                barSize={32}
                data={chartData}
              >
                <RadialBar background dataKey="count" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>

            <div className="absolute flex flex-row gap-1 items-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <FaPersonCircleCheck className="text-[24px] text-[#9cafa4]" />
              <FaPerson className="text-[22px] text-[#679397]" />
            </div>
          </div>

          <div className="flex justify-center gap-16 mt-4">
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-[#9cafa4] rounded-full" />
              <h1 className="font-bold">{totalSellers}</h1>
              <h2 className="text-xs text-gray-500">
                Sellers ({Math.round((totalSellers / (totalSellers + totalCustomers)) * 100)}%)
              </h2>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-5 h-5 bg-[#679397] rounded-full" />
              <h1 className="font-bold">{totalCustomers}</h1>
              <h2 className="text-xs text-gray-500">
                Customers ({Math.round((totalCustomers / (totalSellers + totalCustomers)) * 100)}%)
              </h2>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CountChart;