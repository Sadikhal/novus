import React from 'react';

export const Services = ({ product }) => {
  return (
    <div className='flex flex-col gap-2 font-poppins w-full max-w-lg font-medium '>
      <div className="flex justify-between items-center pb-2 lg:pl-8 w-full gap-5">
        <span className="text-gray-500 whitespace-nowrap xl:w-52 capitalize md:w-full w-24 sm:w-32">
          Delivery
        </span>
        <span className="text-gray-900 w-4 sm:w-6">:</span>
        <div className="pl-2 w-full flex justify-start">
          <span className="text-gray-900 text-left md:text-nowrap">
            Delivery in {product?.deliveryDays} days
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pb-2 lg:pl-8 w-full gap-5">
        <span className="text-gray-500 whitespace-nowrap xl:w-52 capitalize md:w-full w-24 sm:w-32">
          services
        </span>
        <span className="text-gray-900 w-4 sm:w-6">:</span>
        <div className="pl-2 w-full flex justify-start">
          <span className="text-gray-900 text-left md:text-nowrap">
            No cash on delivery is available
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pb-2 lg:pl-8 w-full gap-5">
        <span className="text-gray-500 whitespace-nowrap xl:w-52 capitalize md:w-full w-24 sm:w-32">
          return policy
        </span>
        <span className="text-gray-900 w-4 sm:w-6">:</span>
        <div className="pl-2 w-full flex justify-start">
          <span className="text-gray-900 text-left md:text-nowrap">
            10 days return policy available
          </span>
        </div>
      </div>
    </div>
  );
};