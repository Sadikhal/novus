import { Link, useParams } from 'react-router-dom';
import { MdOutlinePhoneCallback } from "react-icons/md";
import { Loader } from '../../components/ui/Loaders';
import { ErrorFallback } from '../../components/sections/ErrorFallback';
import { useOrderDetails } from '../../hooks/useOrder';
import { OrderStatusTimeline } from '../../components/sections/OrderStatusSetup';

const Order = () => {
  const { orderId } = useParams();
  const { order, loading, error } = useOrderDetails(orderId);

  return (
    <div className='bg-[#ffff] items-center justify-center flex py-3'>
      {loading ? (
        <div className='flex justify-center items-center w-full h-[60vh] md:h-[80vh]'>
          <Loader />
        </div>
      ) : error ? (
        <ErrorFallback message={error}/>
      ) : !order ? (
        <div className="col-span-full text-center bg-lamaWhite h-[30vh] md:h-[40vh] text-gray-500 italic items-center justify-center flex">
          No product found
        </div>
      ) : (
        <div className='bg-lamaWhite w-full lg:w-1/2 shadow-2xl shadow-gray-300 mx-3 border lg:border-none md:mx-0 md:w-[80%]'>
          <div className='py-12 pb-16 p-4'>
            <div className='flex pt-5 flex-col justify-center items-center gap-1'>
              <Link to={`/product/${order.product}`} className='cursor-pointer w-56 h-64'>
                <img src={order.image} className='object-cover rounded-md h-full w-full' alt={order.name} />
              </Link>

              <div className='leading-normal text-lg font-robotos capitalize text-black overflow-hidden whitespace-nowrap font-bold pt-5'>
                {order.name}
              </div>

              <div className='tracking-normal leading-normal text-sm font-rubik capitalize text-[#535766] font-normal'>
                Mast && Harbour men slim blue long shirt
              </div>

              <div className='tracking-normal leading-normal text-sm font-rubik capitalize text-[#535766] font-normal'>
                Price: ₹{order?.price}
              </div>

              <div className='tracking-normal leading-normal text-sm capitalize text-[#4a1c3c] overflow-hidden font-rubik'>
                Quantity: {order?.quantity}
              </div>

              <div className='tracking-normal leading-normal text-sm capitalize text-[#18191e] overflow-hidden font-rubik'>
                Total paid: {order?.quantity} * {order?.price} = {order?.total}
              </div>
            </div>

            <OrderStatusTimeline order={order} />

            <div className='flex flex-col pt-2 bg-[#fff] py-3 px-3 md:px-6'>
              <div className='text-left leading-normal text-[18px] capitalize text-black text-nowrap font-semibold font-robotos tracking-tight'>
                Delivery Address
              </div>
              <div className='flex flex-row gap-5 pt-5 text-left leading-normal text-[14px] capitalize text-black text-nowrap font-semibold font-helvetica tracking-tight'>
                <div>{order.customerName}</div>
                <div>{order.number}</div>
              </div>

              <div className='text-left leading-normal text-[12px] capitalize text-slate-600 text-nowrap font-medium font-robotos tracking-tight'>
                {order?.address}
              </div>
            </div>

            <div className='pt-3'>
              <button className='w-full btn bg-white outline-none h-20 hover:bg-white hover:shadow-sm border-slate-200 hover:shadow-slate-300 rounded-none hover:border-none flex flex-col gap-3'>
                <div className='capitalize w-full text-black font-helvetica text-left'>
                  updates sent to
                </div>
                <div className='flex felx-row gap-3 w-full text-left font-normal font-robotos text-slate-800'>
                  <MdOutlinePhoneCallback />
                  {order?.number}
                </div>
              </button>
            </div>

            <div className='pt-3'>
              <button className='w-full btn bg-white outline-none h-8 hover:bg-white hover:shadow-sm border-slate-200 hover:shadow-slate-300 rounded-none hover:border-none flex flex-col gap-3'>
                <div className='flex felx-row gap-3 w-full text-left font-light font-robotos text-[#3c0d2e]'>
                  order ID {order._id}
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;