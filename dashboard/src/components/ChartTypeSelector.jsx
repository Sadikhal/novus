import { RiBarChartGroupedLine } from "react-icons/ri";
import { FaChartArea, FaChartLine } from "react-icons/fa";

const ChartTypeSelector = ({ chartType, setChartType }) => (
  <div className="flex gap-2 bg-gray-100 rounded-lg">
    <button
      onClick={() => setChartType('bar')}
      className={`sm:px-2 px-1 md:px-3 py-1 rounded-lg flex items-center gap-2 ${
        chartType === 'bar' ? 'bg-[#747660] text-white' : 'bg-white'
      }`}
    >
      <RiBarChartGroupedLine /> Bars
    </button>
    <button
      onClick={() => setChartType('area')}
      className={`sm:px-2 px-1 md:px-3 py-1 rounded-lg flex items-center gap-2 ${
        chartType === 'area' ? 'bg-[#747660] text-white' : 'bg-white'
      }`}
    >
      <FaChartArea /> Area
    </button>
    <button
      onClick={() => setChartType('line')}
      className={`sm:px-2 px-1 md:px-3 py-1 rounded-lg flex items-center gap-2 ${
        chartType === 'line' ? 'bg-[#747660] text-white' : 'bg-white'
      }`}
    >
      <FaChartLine /> Lines
    </button>
  </div>
);

export default ChartTypeSelector;