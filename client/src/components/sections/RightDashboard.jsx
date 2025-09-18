import { useSelector } from 'react-redux';
import { MdOutlineProductionQuantityLimits, MdPendingActions } from 'react-icons/md';
import { TbTruckDelivery } from "react-icons/tb";
import CustomerPerformanceChart from '../sections/CustomerPerformanceChart';
import Heading from '../sections/Heading';
import OrderCard from '../sections/OrderCard';
import DashboardMenu from '../sections/DashboardMenu';
import { Loader } from '../ui/Loaders';
import { useOrdersData } from '../../hooks/useOrders';

const RightDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { data, loading, error } = useOrdersData(currentUser?._id);

  const statsCards = [
    {
      icon: <MdOutlineProductionQuantityLimits className='text-[#edc74a] h-8 w-8'/>,
      title: 'Total Orders',
      value: data?.metrics?.totalOrderedProducts || 0,
      bgColor: 'bg-[#ffff]',
      shadowColor: 'shadow-[#edc74a]/50'
    },
    {
      icon: <MdPendingActions className='text-[#238398] h-8 w-8' />,
      title: 'Pending Orders',
      value: data?.metrics?.pendingProducts || 0,
      bgColor: 'bg-gray-300',
      shadowColor: 'shadow-blue-500/50'
    },
    {
      icon: <TbTruckDelivery className='text-[#815e56] h-8 w-8'/>,
      title: 'Delivered Orders',
      value: data?.metrics?.deliveredProducts || 0,
      bgColor: 'bg-[#dfd982]',
      shadowColor: 'shadow-[#815e56]/50'
    }
  ];

  const renderStatCard = ({ icon, title, value, bgColor, shadowColor }) => (
    <div className="flex w-full h-full justify-start items-center p-5 relative shadow-xl shadow-slate-500/50 bg-white rounded-md gap-5 group hover:scale-105 transition-transform duration-300">
      <div className={`${bgColor} flex-none w-16 h-16 md:w-20 md:h-20 rounded-full flex justify-center items-center text-2xl shadow-xl ${shadowColor} relative group-hover:shadow-slate-500/100`}>
        <div className="flex justify-center items-center z-10">
          {icon}
        </div>
        <div className="rounded-full absolute inset-0 scale-x-0 group-hover:scale-x-100 group-hover:bg-slate-100 transition-transform duration-300 origin-left" />
      </div>

      <div className="flex flex-col justify-start items-start text-slate-600">
        <h2 className="text-2xl lg:text-xl xl:text-2xl font-semibold font-helvetica text-teal-800">{value}</h2>
        <span className="capitalize font-helvetica text-lg lg:text-base xl:text-lg font-semibold text-black">{title}</span>
      </div>
    </div>
  );

  return (
    <div className='w-full'>
      <div className="h-full lg:hidden w-full">
        <DashboardMenu />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 w-full items-stretch justify-items-stretch mt-7 lg:mt-0">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`w-full h-full ${index === 2 ? 'md:col-span-2 lg:col-span-1' : ''}`}
          >
            {renderStatCard(card)}
          </div>
        ))}
      </div>
      <div className="md:h-[680px] h-[700px] w-full mt-5">
        <CustomerPerformanceChart customerId={currentUser?._id} />
      </div>

      <div className="bg-white p-4 mt-5 my-8 rounded-md">
        <Heading title="Recent orders" />
        <div className="pt-2">
          {loading ? (
            <div className='flex justify-center items-center w-full h-[30vh] md:h-[40vh]'>
              <Loader />
            </div>
          ) : error ? (
            <div className="p-4 w-full items-center justify-center bg-red-100 text-red-700 rounded-lg text-center">
              <h3 className="font-bold">Error</h3>
              <p>{error}</p>
            </div>
          ) : data?.orders?.length === 0 ? (
            <div className="text-gray-700 items-center justify-center h-full w-full flex font-poppins">
              No Orders Are Placed
            </div>
          ) : (
            <div className="px-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 bg-[#fff]">
              {data.orders.slice(0, 4).map((listing) => (
                <OrderCard
                  key={listing._id}
                  data={listing}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightDashboard;
