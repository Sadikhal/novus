import { useSelector } from 'react-redux';
import OrderCard from '../../components/sections/OrderCard';
import Heading from '../../components/ui/Headings';
import { OrderListSkeleton } from '../../components/ui/Loaders';
import { ErrorFallback } from '../../components/sections/ErrorFallback';
import { useOrdersData } from '../../hooks/useOrders';

const Orders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { data, loading, error } = useOrdersData(currentUser?._id);

  return (
    <div className='bg-[#f9f7f7] p-4 w-full'>
      <Heading title="All Orders" listings={data?.orders} />
      
      <div className='w-full'>
        {loading ? (
          <OrderListSkeleton />
        ) : error ? (
         <div className='w-full justify-center items-center flex'>
          <ErrorFallback message={error} />
         </div>  
        ) : data?.orders.length === 0 ? (
          <div className="col-span-full text-center bg-lamaWhite h-[30vh] md:h-[40vh] text-gray-500 italic items-center justify-center flex">
            No orders found
          </div>
        ) : (
          <div className="px-2 grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-6 gap-4 py-8 w-full">
            {data?.orders.map((order) => (
              <OrderCard
                key={order._id}
                data={{
                  ...order,
                  orderId: order._id,
                  orderDate: order.createdAt,
                  status: order.status
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;