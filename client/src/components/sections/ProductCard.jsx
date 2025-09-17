import React from 'react';
import { Link } from "react-router-dom";

const ProductCard = ({ data }) => {
  return (
    <Link 
      to={`/product/${data?._id}`} 
      className="cursor-pointer group relative flex flex-col h-full"
    >
      {data?.discount > 0 && (
        <span className="bg-white text-green-800 absolute left-2 top-3 w-16 text-xs font-poppins text-center py-1 font-semibold z-10">
          save {data?.discount}%
        </span>
      )}
      
      <div className="w-full transition duration-0 h-full flex flex-col">
        <div className="flex flex-col w-full h-full">
          <div className="w-full relative overflow-hidden flex-grow">
            <img 
              className="object-cover h-full w-full duration-500 group-hover:scale-150 transition max-h-[200px]"
              src={`${data.image[0]}`}
              alt="Listing"
            />
          </div>
          
          <div className="font-semibold text-sm text-[#282c3f]  whitespace-nowrap font-poppins overflow-hidden px-2 capitalize pt-1">
            {data.name}
          </div>
          <div className="sm:text-[13px] text-xs font-robotos font-medium capitalize text-[#424e13] overflow-hidden whitespace-nowrap px-2 pt-1">
            {data.brand}
          </div>
          <div className="flex flex-row gap-2 text-left items-center px-2">
            {data.discount ? (
              <>
                <div className="text-[#c12d2d] font-poppins text-[10px] sm:text-[11px] whitespace-nowrap line-through font-semibold">
                  R.S {data.actualPrice}
                </div>
                <div className="font-semibold font-poppins sm:text-[13px] text-xs text-slate-950">
                  R.S {data.sellingPrice}
                </div>
              </>
            ) : (
              <div className="font-bold font-poppins text-[14px] text-slate-900">
                R.S {data.sellingPrice}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;