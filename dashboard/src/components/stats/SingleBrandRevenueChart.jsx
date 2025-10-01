// // import { useState } from "react";
// // import { 
// //   AreaChart, 
// //   Area, 
// //   LineChart, 
// //   Line, 
// //   BarChart, 
// //   Bar, 
// //   XAxis, 
// //   YAxis, 
// //   CartesianGrid, 
// //   Tooltip, 
// //   ResponsiveContainer, 
// //   Legend 
// // } from "recharts";
// // import { useChartData } from "../../hooks/useChartData";
// // import DatePicker from "react-datepicker";
// // import "react-datepicker/dist/react-datepicker.css";
// // import { ErrorFallback, Loader } from "../ui/Loaders";
// // import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";
// // import { ChevronDown } from "lucide-react";
// // import { BsGraphDownArrow, BsGraphUpArrow } from "react-icons/bs";

// // const gradientColors = {
// //   top: ['#3d3209a6', '#f9f871'],
// //   least: ['#c34a36', '#ffc75f']
// // };

// // const BrandProductRevenuePerformance = ({ brandId }) => {
// //   const [timeFrame, setTimeFrame] = useState("monthly");
// //   const [performanceType, setPerformanceType] = useState("top");
// //   const [chartType, setChartType] = useState("area");
// //   const [dateRange, setDateRange] = useState([null, null]);
  
// //   const params = {
// //     period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
// //     sort: performanceType === 'top' ? 'desc' : 'asc',
// //     timeRange: dateRange[0] && dateRange[1] 
// //       ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
// //       : undefined
// //   };
  
// //   const { data, loading, error } = useChartData(
// //     `/stats/brand/${brandId}/revenue-performance`, 
// //     params, 
// //     [timeFrame, performanceType, dateRange, brandId]
// //   );

// //   const CustomTooltip = ({ active, payload }) => {
// //     if (active && payload && payload.length) {
// //       const data = payload[0].payload;
// //       return (
// //         <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
// //           {data.image && (
// //             <img 
// //               src={data.image} 
// //               alt={data.productName} 
// //               className="w-20 h-20 object-cover mb-3 mx-auto rounded-lg"
// //             />
// //           )}
// //           <h3 className="font-bold text-center text-lg mb-2">{data.productName}</h3>
// //           <div className="grid gap-2">
// //             <p className="text-sm bg-blue-50 p-2 rounded">
// //               <span className="font-semibold">Id:</span> {data.productId}
// //             </p>
// //             <p className="text-sm bg-orange-50 p-2 rounded">
// //               <span className="font-semibold">Total Sold:</span> {data.totalSold}
// //             </p>
// //             <p className="text-sm bg-green-50 p-2 rounded">
// //               <span className="font-semibold">Revenue:</span> ${data.totalRevenue?.toFixed(2)}
// //             </p>
// //             <p className="text-sm bg-purple-50 p-2 rounded">
// //               <span className="font-semibold">Avg. Order:</span> ${data.avgOrderValue?.toFixed(2)}
// //             </p>
// //           </div>
// //         </div>
// //       );
// //     }
// //     return null;
// //   };

// //   const renderChart = () => {
// //     const chartProps = {
// //       data: data,
// //       margin: { top: 20, right: 10, left: 10, bottom: 5 }
// //     };

// //     switch(chartType) {
// //       case 'area':
// //         return (
// //           <AreaChart {...chartProps}>
// //             <defs>
// //               <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
// //                 <stop offset="5%" stopColor={gradientColors[performanceType][0]} stopOpacity={0.8}/>
// //                 <stop offset="95%" stopColor={gradientColors[performanceType][1]} stopOpacity={0.2}/>
// //               </linearGradient>
// //             </defs>
// //             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
// //             <XAxis
// //               dataKey="productName"
// //               angle={-45}
// //               textAnchor="end"
// //               tick={{ fontSize: 12 }}
// //               interval={0}
// //               tickLine={false}
// //               height={60}
// //             />
// //             <YAxis 
// //               tickFormatter={value => `$${value}`} 
// //               width={60}
// //               tick={{ fontSize: 14 }}
// //             />
// //             <Tooltip content={<CustomTooltip />} />
// //             <Legend 
// //               formatter={(value) => <span className="text-gray-600">{value}</span>}
// //               iconType="circle"
// //             />
// //             <Area
// //               type="monotone"
// //               dataKey="totalRevenue"
// //               stroke={gradientColors[performanceType][0]}
// //               fillOpacity={1}
// //               fill="url(#colorUv)"
// //               strokeWidth={2}
// //               name="Total Revenue"
// //             />
// //           </AreaChart>
// //         );

// //       case 'line':
// //         return (
// //           <LineChart {...chartProps}>
// //             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
// //             <XAxis
// //               dataKey="productName"
// //               angle={-45}
// //               textAnchor="end"
// //               tick={{ fontSize: 12 }}
// //               interval={0}
// //               tickLine={false}
// //               height={60}
// //             />
// //             <YAxis 
// //               tickFormatter={value => `$${value}`}
// //               width={60}
// //               tick={{ fontSize: 14 }} 
// //             />
// //             <Tooltip content={<CustomTooltip />} />
// //             <Legend 
// //               formatter={(value) => <span className="text-gray-600">{value}</span>}
// //               iconType="circle"
// //             />
// //             <Line
// //               type="monotone"
// //               dataKey="totalRevenue"
// //               stroke={gradientColors[performanceType][0]}
// //               strokeWidth={2}
// //               dot={{ fill: gradientColors[performanceType][1], strokeWidth: 2 }}
// //               activeDot={{ r: 8 }}
// //               name="Total Revenue"
// //             />
// //           </LineChart>
// //         );

// //       default:
// //         return (
// //           <BarChart {...chartProps}>
// //             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
// //             <XAxis
// //               dataKey="productName"
// //               angle={-45}
// //               textAnchor="end"
// //               tick={{ fontSize: 12 }}
// //               interval={0}
// //               tickLine={false}
// //               height={60}
// //             />
// //             <YAxis 
// //               tickFormatter={value => `$${value}`} 
// //               width={60}
// //               tick={{ fontSize: 14 }}
// //             />
// //             <Tooltip content={<CustomTooltip />} />
// //             <Legend 
// //               formatter={(value) => <span className="text-gray-600">{value}</span>}
// //               iconType="circle"
// //             />
// //             <Bar
// //               dataKey="totalRevenue"
// //               fill={gradientColors[performanceType][0]}
// //               radius={[4, 4, 0, 0]}
// //               name="Total Revenue"
// //             />
// //           </BarChart>
// //         );
// //     }
// //   };

// //   return (
// //     <div className="bg-white rounded-xl p-4 h-full flex flex-col shadow-sm">
// //       <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
// //         <h1 className="sm:text-xl text-lg font-bold text-gray-800 text-nowrap flex items-center gap-2">
// //           {performanceType === 'top' ? (
// //             <>
// //               <BsGraphUpArrow className="text-teal-800" /> 
// //               <span>Top Performing Products</span>
// //             </>
// //           ) : (
// //             <>
// //               <BsGraphDownArrow className="text-[#c34a36]" />
// //               <span>Least Performing Products</span>
// //             </>
// //           )}
// //         </h1>
        
// //         <div className="flex flex-wrap gap-3 items-center">
// //           <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
// //             <button
// //               onClick={() => setChartType("bar")}
// //               className={`sm:px-3 py-1 rounded-lg flex items-center gap-2 px-2 ${
// //                 chartType === "bar" 
// //                   ? 'bg-[#3d3209a6] text-slate-100'
// //                   : 'bg-gray-100 hover:bg-gray-200'
// //               }`}
// //             >
// //               Bars
// //             </button>
// //             <button
// //               onClick={() => setChartType("area")}
// //               className={`sm:px-3 py-1 rounded-lg flex items-center gap-2 px-2 ${
// //                 chartType === "area" 
// //                   ? 'bg-[#3d3209a6] text-slate-100'
// //                   : 'bg-gray-100 hover:bg-gray-200'
// //               }`}
// //             >
// //               Area
// //             </button>
// //             <button
// //               onClick={() => setChartType("line")}
// //               className={`sm:px-3 py-1 rounded-lg flex items-center gap-2 px-2 ${
// //                 chartType === "line" 
// //                   ? 'bg-[#3d3209a6] text-slate-100'
// //                   : 'bg-gray-100 hover:bg-gray-200'
// //               }`}
// //             >
// //               Lines
// //             </button>
// //           </div>
          
// //           <Select 
// //             value={performanceType}
// //             onValueChange={(value) => setPerformanceType(value)}
// //           >
// //             <SelectTrigger className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 items-center text-nowrap flex flex-row justify-between">
// //               <SelectValue placeholder="Performance Type" />
// //               <ChevronDown className="h-4 w-4" />
// //             </SelectTrigger>
// //             <SelectContent className="bg-white">
// //               <SelectGroup>
// //                 <SelectItem value="top">Top Performers</SelectItem>
// //                 <SelectItem value="least">Low Performers</SelectItem>
// //               </SelectGroup>
// //             </SelectContent>
// //           </Select>
          
// //           <Select
// //             value={timeFrame}
// //             onValueChange={(value) => setTimeFrame(value)}
// //           >
// //             <SelectTrigger 
// //               className="border-gray-200 rounded-lg px-2 py-2 text-sm bg-white shadow-sm w-44 items-center text-nowrap flex flex-row justify-between" 
// //               disabled={dateRange[0] !== null}
// //             >
// //               <SelectValue placeholder="Time Frame" />
// //               <ChevronDown className="h-4 w-4" />
// //             </SelectTrigger>
// //             <SelectContent className="bg-white">
// //               <SelectGroup>
// //                 <SelectItem value="daily">Today</SelectItem>
// //                 <SelectItem value="weekly">This Week</SelectItem>
// //                 <SelectItem value="monthly">This Month</SelectItem>
// //                 <SelectItem value="yearly">This Year</SelectItem>
// //               </SelectGroup>
// //             </SelectContent>
// //           </Select>
          
// //           <DatePicker
// //             selectsRange
// //             startDate={dateRange[0]}
// //             endDate={dateRange[1]}
// //             onChange={setDateRange}
// //             placeholderText="Custom Date Range"
// //             className="border border-gray-200 rounded-lg px-4 py-2 text-sm bg-white shadow-sm w-48"
// //             isClearable
// //           />
// //         </div>
// //       </div>

// //       {loading ? (
// //         <div className="flex-1 flex items-center justify-center">
// //           <Loader />
// //         </div>
// //       ) : error ? (
// //         <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
// //           <ErrorFallback message={error} />
// //         </div>
// //       ) : (!data || data.length === 0) ? (
// //         <div className="flex-1 flex flex-col items-center justify-center p-8">
// //           <p className="text-gray-500 font-medium">No product performance data</p>
// //         </div>
// //       ) : (
// //         <div className="flex-1 h-full min-h-[500px]">
// //           <ResponsiveContainer width="100%" height="95%">
// //             {renderChart()}
// //           </ResponsiveContainer>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default BrandProductRevenuePerformance;
// import { useState, useMemo, useEffect, useRef } from "react";
// import {
//   AreaChart,
//   Area,
//   LineChart,
//   Line,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import { useChartData } from "../../hooks/useChartData";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { ErrorFallback } from "../ui/Loaders";
// import ChartTypeSelector from "../ChartTypeSelector";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/Select";
// import { ChevronDown } from "lucide-react";
// import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";
// import { ScrollArea } from "../ui/ScrollArea";

// const productGradient = ["#7b3fb2", "#ffb86b"]; 
// const ChartSkeleton = () => (
//   <div className="h-full w-full flex items-center justify-center">
//     <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
//   </div>
// );

// const BrandProductRevenuePerformance = ({ brandId , brandName }) => {
//   const [timeFrame, setTimeFrame] = useState("monthly");
//   const [performanceType, setPerformanceType] = useState("top");
//   const [chartType, setChartType] = useState("area");
//   const [dateRange, setDateRange] = useState([null, null]);

//   const params = {
//     period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
//     sort: performanceType === "top" ? "desc" : "asc",
//     timeRange:
//       dateRange[0] && dateRange[1]
//         ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
//         : undefined,
//   };

//   const { data = [], loading, error } = useChartData(
//     `/stats/brand/${brandId}/revenue-performance`,
//     params,
//     [timeFrame, performanceType, dateRange, brandId]
//   );

//   // container width & responsive scroll logic (same approach as BrandPerformanceChart)
//   const containerRef = useRef(null);
//   const [containerWidth, setContainerWidth] = useState(900);
//   useEffect(() => {
//     const updateWidth = () => {
//       if (containerRef.current) setContainerWidth(containerRef.current.offsetWidth);
//     };
//     updateWidth();
//     window.addEventListener("resize", updateWidth);
//     return () => window.removeEventListener("resize", updateWidth);
//   }, []);

//   // Ensure data is safe & numeric where needed
//   const safeData = useMemo(() => {
//     if (!Array.isArray(data)) return [];
//     return data.map((d) => ({
//       productId: d.productId,
//       productName: d.productName ?? "Unknown",
//       image: d.image,
//       brandName:brandName,
//       totalRevenue: Number(d.totalRevenue ?? 0),
//       totalSold: Number(d.totalSold ?? 0),
//       avgOrderValue: Number(d.avgOrderValue ?? 0),
//       ...d,
//     }));
//   }, [data]);


//   const { chartWidth, barSize } = useMemo(() => {
//     const points = safeData.length || 0;
//     const minBarWidth = 38;
//     const defaultGap = 8;

//     if (points === 0) return { chartWidth: containerWidth, barSize: minBarWidth };

//     const labelWidths = safeData.map((d) => Math.max(60, String(d.brandName).length * 28));
//     const totalLabelWidth = labelWidths.reduce((a, b) => a + b, 0);
//     const totalGap = points > 1 ? (points - 1) * defaultGap : 0;

//     let calculatedBarSize = minBarWidth;
//     const totalRequiredWidth = totalLabelWidth + totalGap;

//     if (totalRequiredWidth <= containerWidth) {
//       const scale = (containerWidth - totalGap) / totalLabelWidth;
//       calculatedBarSize = Math.max(minBarWidth, Math.min(minBarWidth + 10, minBarWidth * scale));
//     }

//     return {
//       chartWidth: Math.max(containerWidth, totalRequiredWidth + totalGap),
//       barSize: calculatedBarSize,
//     };
//   }, [safeData, containerWidth]);

//   const isOverflowing = chartWidth > containerWidth;

//   const tickEvery = useMemo(() => {
//     const pts = safeData.length;
//     if (pts <= 10) return 1;
//     if (pts <= 20) return 1;
//     if (pts <= 40) return 2;
//     if (pts <= 80) return 4;
//     return Math.ceil(pts / 40);
//   }, [safeData.length]);

//   const formatXAxisLabel = (name) => {
//     // shortens long product names a bit to avoid overflow on ticks
//     if (!name) return "";
//     return name.length > 20 ? name.slice(0, 18) + "…" : name;
//   };

//   // Tooltip matching BrandPerformanceChart style but product-specific and rupee
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       const row = payload[0].payload;
//       return (
//         <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
//           <div className="font-bold text-center text-base mb-2 text-[#02638c]">{row.productName}</div>
//           <div className="grid gap-2">
//             {row.image && (
//               <img
//                 src={row.image}
//                 alt={row.productName}
//                 className="w-24 h-24 object-cover mb-1 rounded-lg mx-auto"
//               />
//             )}
//             <p className="text-sm bg-blue-50 p-2 rounded">
//               <span className="font-semibold">Product Id:</span> {row.productId}
//             </p>
//             <p className="text-sm bg-orange-50 p-2 rounded">
//               <span className="font-semibold">Total Sold:</span> {row.totalSold ?? 0}
//             </p>
//             <p className="text-sm bg-green-50 p-2 rounded">
//               <span className="font-semibold">Revenue:</span> ₹{Number(row.totalRevenue ?? 0).toFixed(2)}
//             </p>
//             <p className="text-sm bg-purple-50 p-2 rounded">
//               <span className="font-semibold">Avg. Order:</span> ₹{Number(row.avgOrderValue ?? 0).toFixed(2)}
//             </p>
//           </div>
//         </div>
//       );
//     }
//     return null;
//   };

//   const chartProps = { data: safeData, margin: { top: 20, right: 10, left: 10, bottom: 5 } };
//   const dataKey = "totalRevenue";
//   const yAxisFormatter = (v) => `₹${v}`;

//   const renderChart = () => {
//     switch (chartType) {
//       case "area":
//         return (
//           <AreaChart {...chartProps} width={chartWidth} height={400}>
//             <defs>
//               <linearGradient id="productGrad" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor={productGradient[0]} stopOpacity={0.98} />
//                 <stop offset="100%" stopColor={productGradient[1]} stopOpacity={0.62} />
//               </linearGradient>
//             </defs>

//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//             <XAxis
//               dataKey="productName"
//               tickFormatter={formatXAxisLabel}
//               interval={0}
//               tick={{ fontSize: 12 }}
//               tickLine={false}
//               height={80}
//               textAnchor="end"
//               ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.productName : null)).filter(Boolean)}
//             />
//             <YAxis tickFormatter={yAxisFormatter} width={80} tick={{ fontSize: 12 }} />
//             <Legend iconType="circle" />
//             <Tooltip content={<CustomTooltip />} />
//             <Area
//               type="monotone"
//               dataKey={dataKey}
//               stroke={productGradient[0]}
//               fill="url(#productGrad)"
//               strokeWidth={2}
//               isAnimationActive
//               animationDuration={900}
//             />
//           </AreaChart>
//         );

//       case "line":
//         return (
//           <LineChart {...chartProps} width={chartWidth} height={400}>
//             <defs>
//               <linearGradient id="productGrad" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor={productGradient[0]} stopOpacity={0.98} />
//                 <stop offset="100%" stopColor={productGradient[1]} stopOpacity={0.62} />
//               </linearGradient>
//             </defs>

//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//             <XAxis
//               dataKey="productName"
//               tickFormatter={formatXAxisLabel}
//               interval={0}
//               tick={{ fontSize: 12 }}
//               tickLine={false}
//               height={80}
//               textAnchor="end"
//               ticks={safeData.map((d, i) => (i % tickEvery === 0 ? d.productName : null)).filter(Boolean)}
//             />
//             <YAxis tickFormatter={yAxisFormatter} width={80} tick={{ fontSize: 14 }} />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend iconType="circle" />
//             <Line
//               type="monotone"
//               dataKey={dataKey}
//               stroke={productGradient[0]}
//               strokeWidth={2}
//               dot={{ r: 4, fill: productGradient[1] }}
//               activeDot={{ r: 8 }}
//               isAnimationActive
//               animationDuration={900}
//             />
//           </LineChart>
//         );

//       default:
//         return (
//           <BarChart {...chartProps} width={chartWidth} height={400}>
//             <defs>
//               <linearGradient id="productGrad" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="0%" stopColor={productGradient[0]} stopOpacity={0.98} />
//                 <stop offset="100%" stopColor={productGradient[1]} stopOpacity={0.62} />
//               </linearGradient>
//             </defs>

//             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//             <XAxis
//               dataKey="productName"
//               tickFormatter={formatXAxisLabel}
//               interval={0}
//               tick={{ fontSize: 12 }}
//               tickLine={false}
//               height={80}
//               textAnchor="end"
//             />
//             <YAxis tickFormatter={yAxisFormatter} width={80} tick={{ fontSize: 14 }} />
//             <Tooltip content={<CustomTooltip />} />
//             <Legend iconType="circle" />
//             <Bar
//               dataKey={dataKey}
//               radius={[4, 4, 0, 0]}
//               maxBarSize={barSize}
//               fill="url(#productGrad)"
//               isAnimationActive
//               animationDuration={900}
//             />
//           </BarChart>
//         );
//     }
//   };

//   // consistent SelectTrigger class (copied from BrandPerformanceChart)
//   const selectTriggerClass =
//     "border-gray-200 rounded-lg px-2 py-2 sm:text-sm bg-white shadow-sm w-36 md:w-44 flex justify-between items-center md:text-sm text-xs";

//   return (
//     <div ref={containerRef} className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-md border border-gray-100">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
//         <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//           {performanceType === "top" ? (
//             <>
//               <BsGraphUpArrow className="text-teal-800" />
//               <span>Top Performing Products</span>
//             </>
//           ) : (
//             <>
//               <BsGraphDownArrow className="text-[#c34a36]" />
//               <span>Least Performing Products</span>
//             </>
//           )}
//         </h1>

//         <div className="flex flex-wrap gap-3 items-center">
//           <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

//           <Select value={performanceType} onValueChange={(v) => setPerformanceType(v)}>
//             <SelectTrigger className={selectTriggerClass}>
//               <SelectValue placeholder="Performance Type" />
//               <ChevronDown className="h-4 w-4" />
//             </SelectTrigger>
//             <SelectContent className="bg-white w-36 md:w-44">
//               <SelectGroup>
//                 <SelectItem className="md:text-sm text-xs" value="top">
//                   Top Performers
//                 </SelectItem>
//                 <SelectItem className="md:text-sm text-xs" value="least">
//                   Low Performers
//                 </SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>

//           <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v)}>
//             <SelectTrigger className={selectTriggerClass} disabled={dateRange[0] !== null}>
//               <SelectValue placeholder="Select timeframe" />
//               <ChevronDown className="h-4 w-4" />
//             </SelectTrigger>
//             <SelectContent className="bg-white w-36 md:w-44">
//               <SelectGroup>
//                 <SelectItem className="md:text-sm text-xs" value="daily">
//                   Daily
//                 </SelectItem>
//                 <SelectItem className="md:text-sm text-xs" value="weekly">
//                   Weekly
//                 </SelectItem>
//                 <SelectItem className="md:text-sm text-xs" value="monthly">
//                   Monthly
//                 </SelectItem>
//                 <SelectItem className="md:text-sm text-xs" value="yearly">
//                   Yearly
//                 </SelectItem>
//               </SelectGroup>
//             </SelectContent>
//           </Select>

//           <DatePicker
//             selectsRange
//             startDate={dateRange[0]}
//             endDate={dateRange[1]}
//             onChange={setDateRange}
//             placeholderText="Custom Date Range"
//             className="border border-gray-200 rounded-lg px-3 py-2 w-36 md:w-48 text-xs md:text-sm bg-white shadow-sm"
//             isClearable
//           />
//         </div>
//       </div>

//       {loading ? (
//         <div className="flex-1 flex items-center justify-center">
//           <ChartSkeleton />
//         </div>
//       ) : error ? (
//         <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
//           <ErrorFallback message={error} />
//         </div>
//       ) : !safeData || safeData.length === 0 ? (
//         <div className="flex-1 flex flex-col items-center justify-center p-8">
//           <p className="text-gray-500 font-medium">No product performance data</p>
//         </div>
//       ) : (
//         <div className="flex-1 h-full min-h-[400px] relative">
//           {isOverflowing && (
//             <>
//               <div className="pointer-events-none absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-white via-white/60 to-transparent" />
//               <div className="pointer-events-none absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-white via-white/60 to-transparent" />
//             </>
//           )}

//           <ScrollArea orientation="horizontal" className="h-full">
//             <div style={{ minWidth: `${chartWidth}px`, height: "100%" }}>{renderChart()}</div>
//           </ScrollArea>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BrandProductRevenuePerformance;


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
import { BsGraphUpArrow, BsGraphDownArrow } from "react-icons/bs";
import { ScrollArea } from "../ui/ScrollArea";

const productGradient = ["#166b60", "#39c496"];

const ChartSkeleton = () => (
  <div className="h-full w-full flex items-center justify-center">
    <div className="w-11/12 h-80 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
  </div>
);

const BrandProductRevenuePerformance = ({ brandId, brandName }) => {
  const [timeFrame, setTimeFrame] = useState("weekly");
  const [performanceType, setPerformanceType] = useState("top");
  const [chartType, setChartType] = useState("bar");
  const [dateRange, setDateRange] = useState([null, null]);

  const params = {
    period: dateRange[0] && dateRange[1] ? undefined : timeFrame,
    sort: performanceType === "top" ? "desc" : "asc",
    timeRange:
      dateRange[0] && dateRange[1]
        ? `${dateRange[0].toISOString()}_${dateRange[1].toISOString()}`
        : undefined,
  };

  const { data = [], loading, error } = useChartData(
    `/stats/brand/${brandId}/revenue-performance`,
    params,
    [timeFrame, performanceType, dateRange, brandId]
  );

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
      const short =
        typeof name === "string" && name.length > 20 ? name.slice(0, 18).trim() + "…" : name;
      return {
        productId: d.productId ?? d.id ?? null,
        productName: name,
        productNameShort: short,
        image: d.image ?? null,
        brandName: brandName ?? "",
        totalRevenue: Number(d.totalRevenue ?? 0),
        totalSold: Number(d.totalSold ?? 0),
        avgOrderValue: Number(d.avgOrderValue ?? 0),
        ...d,
      };
    });
  }, [data, brandName]);

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
    return name.length > 20 ? name.slice(0, 18) + "…" : name;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const row = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <div className="font-bold text-center text-sm mb-2 text-[#02638c]">{row.productName}</div>
          <div className="grid gap-2">
            {row.image && (
              <img
                src={row.image}
                alt={row.productName}
                className="w-16 h-16 object-cover mb-1 rounded-lg mx-auto"
              />
            )}
            {row.productId && (
              <p className="text-xs bg-blue-50 p-2 rounded">
                <span className="font-semibold">Product Id:</span> {row.productId}
              </p>
            )}
            <p className="text-xs bg-orange-50 p-2 rounded">
              <span className="font-semibold">Total Sold:</span> {row.totalSold ?? 0}
            </p>
            <p className="text-xs bg-green-50 p-2 rounded">
              <span className="font-semibold">Revenue:</span> ₹{Number(row.totalRevenue ?? 0).toFixed(2)}
            </p>
            <p className="text-xs bg-purple-50 p-2 rounded">
              <span className="font-semibold">Avg. Order:</span> ₹{Number(row.avgOrderValue ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const chartProps = { data: safeData, margin: { top: 0, right:5, left: 10, bottom: 1 } };
  const dataKey = "totalRevenue";
  const yAxisFormatter = (v) => `₹${v}`;

  const renderChart = () => {
    switch (chartType) {
      case "area":
        return (
          <AreaChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="productGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={productGradient[0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={productGradient[1]} stopOpacity={0.62} />
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
            <YAxis tickFormatter={yAxisFormatter} width={100} tick={{ fontSize: 12 }} />
            <Legend iconType="circle" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={productGradient[0]}
              fill="url(#productGrad)"
              strokeWidth={2}
              isAnimationActive
              animationDuration={900}
            />
          </AreaChart>
        );

      case "line":
        return (
          <LineChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="productGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={productGradient[0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={productGradient[1]} stopOpacity={0.62} />
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
            <YAxis tickFormatter={yAxisFormatter} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={productGradient[0]}
              strokeWidth={2}
              dot={{ r: 4, fill: productGradient[1] }}
              activeDot={{ r: 8 }}
              isAnimationActive
              animationDuration={900}
            />
          </LineChart>
        );

      default:
        return (
          <BarChart {...chartProps} width={chartWidth} height={400}>
            <defs>
              <linearGradient id="productGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={productGradient[0]} stopOpacity={0.98} />
                <stop offset="100%" stopColor={productGradient[1]} stopOpacity={0.62} />
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
            <YAxis tickFormatter={yAxisFormatter} width={100} tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend iconType="circle" />
            <Bar
              dataKey={dataKey}
              radius={[4, 4, 0, 0]}
              maxBarSize={barSize}
              fill="url(#productGrad)"
              isAnimationActive
              animationDuration={900}
            />
          </BarChart>
        );
    }
  };

  const selectTriggerClass =
    "border-gray-200 rounded-lg px-2 py-2 sm:text-sm bg-white shadow-sm w-36 md:w-44 flex text-nowrap justify-between items-center md:text-sm text-xs";

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 h-full flex flex-col shadow-md border border-gray-100">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          {performanceType === "top" ? (
            <>
              <BsGraphUpArrow className="text-teal-800" />
              <span>Top Performing Products</span>
            </>
          ) : (
            <>
              <BsGraphDownArrow className="text-[#c34a36]" />
              <span>Least Performing Products</span>
            </>
          )}
        </h1>

        <div className="flex flex-wrap gap-3 items-center">
          <ChartTypeSelector chartType={chartType} setChartType={setChartType} />

          <Select value={performanceType} onValueChange={(v) => setPerformanceType(v)}>
            <SelectTrigger className={selectTriggerClass}>
              <SelectValue placeholder="Performance Type" />
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

          <Select value={timeFrame} onValueChange={(v) => setTimeFrame(v)}>
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
            className="border border-gray-200 rounded-lg px-3 py-2 w-36 md:w-48 text-xs md:text-sm bg-white shadow-sm"
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
          <p className="text-gray-500 font-medium">No product performance data</p>
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

export default BrandProductRevenuePerformance;
