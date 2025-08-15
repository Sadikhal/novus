import { FaChevronRight } from "react-icons/fa";
import { formatDate } from "../../lib/utils";
import {Button} from "../ui/Button";


export const OrderStatusTimeline = ({ order }) => {
  const statusItems = [
    {
      title: 'Order placed',
      date: order?.createdAt,
      buttonClass: 'bg-white text-black hover:bg-white',
      showChevron: false
    },
    {
      title: 'Processed',
      date: null,
      buttonClass: 'bg-cyan-800 text-white hover:bg-[#7e5b03]',
      showChevron: true
    },
    {
      title: 'Shipped',
      date: order?.shippedTime,
      buttonClass: 'bg-white text-black hover:bg-[#7e5b03]',
      showChevron: true
    },
    {
      title: 'Delivered',
      date: order?.deliveredAt,
      buttonClass: 'bg-[#597e03] text-lamaWhite hover:bg-[#7e5b03]',
      showChevron: false
    }
  ];

  return (
    <div className='md:px-2 pt-5'>
      {statusItems.map((item, index) => (
        <Button 
          key={index}
          className={`flex flex-row justify-between w-full outline-none border-x-0 border-t-0 h-16 hover:shadow-sm hover:shadow-slate-300 hover:scale-[1.02] rounded-none border-slate-200 hover:border-none ${item.buttonClass}`}
        >
          <div className='flex flex-col justify-start'>
            <div className='text-left tracking-tight leading-normal text-[15px] capitalize text-nowrap font-semibold font-helvetica'>
              {item.title}
            </div>
            {item.date ? (
              <div className='text-left tracking-normal text-[12px] capitalize text-[#279488] overflow-hidden font-poppins font-medium'>
                {formatDate(item.date)}
              </div>
            ) : (
              <span className='italic text-[10px] capitalize'>not completed yet</span>
            )}
          </div>
          {item.showChevron && <FaChevronRight />}
        </Button>
      ))}
    </div>
  );
};
