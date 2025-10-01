import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

const ListingCards = ({ data, type }) => {  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (isHovered && data?.image && data?.image.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % data?.image?.length);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      if (!isHovered) setCurrentImageIndex(0);
    };
  }, [isHovered, data?.image]);

  return type === 'category' ? (
    <Link 
      to='/admin/category'
      className='flex flex-col gap-1 items-center cursor-pointer border-slate-100 group col-span-1 py-3 h-full w-full'
    >
      <div className='relative overflow-hidden w-full transition duration-0 h-36 md:h-48 flex items-center'>
        <img 
          className="aspect-square object-cover w-full duration-500 transition-transform group-hover:scale-110 rounded-lg"
          src={data?.image}
          alt={data?.name}
          lazy="loading"
        />
      </div>
      <div className="text-center w-full px-1 pt-1">
         <div className="text-[14px] text-gray-500">
          {data?.title2}
        </div>
        <div className="font-bold text-[16px] text-[#282c3f] whitespace-nowrap font-assistant overflow-hidden">
          {data?.title}
        </div>
       
      </div>
    </Link>
  ) : (
    <Link 
      to={`/admin/product/${data?._id}`}  
      className="col-span-1 cursor-pointer w-full group relative border border-slate-200 rounded-xl flex flex-col pb-1 h-full"
    >
      <div className="w-full transition duration-0 h-full flex flex-col">
        <div className="flex flex-col sm:gap-2 gap-1 w-full flex-grow">
          <div 
            className="relative overflow-hidden rounded-xl flex-grow"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {data?.image?.length > 0 ? (
              <>
                <img 
                  className="aspect-square object-cover w-full duration-500 transition-transform group-hover:scale-110"
                  src={data?.image[currentImageIndex]}
                  alt={data?.name}
                />
                
                {data?.image.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                    {data?.image.map((_, index) => (
                      <div
                        key={index}
                        className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125' 
                            : 'bg-white/50 scale-100'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full aspect-square" />
            )}
          </div>
          
          <div className="px-2 flex-grow flex flex-col justify-end">
            <div className="font-bold sm:text-[16px] text-[14px] text-[#282c3f]  whitespace-nowrap overflow-hidden font-assistant">
              {data?.name}
            </div>
            
            <div className="sm:text-[14px] text-[12px] font-assistant capitalize text-[#535766] overflow-hidden whitespace-nowrap">
              {data?.brand}
            </div>
            
            <div className="flex flex-row gap-2 text-left items-baseline overflow-hidden mt-1">
              {data?.discount ? (
                <>
                  <del className="font-normal text-[#7e818c] font-assistant sm:text-[12px] text-[10px] whitespace-nowrap">
                    R.S {data?.actualPrice}
                  </del>
                  <div className="font-bold font-assistant sm:text-[14px] text-[12px] text-slate-950 whitespace-nowrap">
                    R.S {data?.sellingPrice}
                  </div>
                  <div className="font-medium font-assistant sm:text-[12px] text-[#ff5722] whitespace-nowrap text-[10px]">
                    {data?.discount}% off
                  </div>
                </>
              ) : (
                <div className="font-bold font-assistant text-[14px] text-slate-950 whitespace-nowrap">
                  R.S {data?.sellingPrice}
                </div>
              )}
            </div>
          </div>
        </div>

        {data?.offer && (
          <div className='text-[#ff5722] font-bold font-assistant text-[12px] px-2 mt-2'>
            only few left
          </div>
        )}
      </div>
    </Link>
  );
}

export default ListingCards;