import { Link } from "react-router-dom";

const OrderCard = ({ data }) => {
  const { 
    _id, 
    createdAt, 
    status, 
    image, 
    name, 
    price, 
    total,
    deliveryTime,
    shippedTime
  } = data;

  const orderDate = new Date(createdAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <Link 
      to={`/dashboard/order/${_id}`}
      className="col-span-1 cursor-pointer group relative border border-borderSlate  flex flex-col bg-lamaWhite"
    >
      <span className="bg-white text-green-700 absolute left-2 top-3 right-0 w-20 text-xs font-assistant text-center py-1 font-semibold inline-block z-10 text-nowrap ">
        {status}
      </span>
      <div className="w-full transition duration-0">
        <div>
          <div className="flex flex-col w-full">
            <div className="w-full relative overflow-hidden">
              <img 
                className="aspect-square object-cover sm:h-full h-[250px] w-full duration-500 group-hover:scale-150 transition"
                src={image}
                alt={name}
              />
            </div>
            <div className="text-[14px] font-assistant capitalize text-[#3b3e4b] overflow-hidden font-semibold whitespace-nowrap px-2 mt-2">
              {name}
            </div>
            <div className="flex flex-col text-left px-2">
              <div className="font-bold text-[14px] text-[#1e2134]  whitespace-nowrap font-assistant overflow-hidden capitalize">
              Total: ₹{total || price}
              </div>
              <div className="font-medium text-[#0a6246] font-assistant capitalize text-[12px] whitespace-nowrap ">
              Ordered on: {orderDate}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;