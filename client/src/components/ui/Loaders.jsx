// components/loaders/SkeletonLoader.jsx
import { SearchIcon } from 'lucide-react';
import React from 'react';
import { cn } from "../../lib/utils"

export const SkeletonLoader = ({ 
  type = 'product', 
  count = 1,
  className = ''
}) => {
  const elements = Array(count).fill(0);
  
  return (
    <div className={`flex flex-nowrap gap-4 pb-4 ${className}`}>
      {elements.map((_, i) => (
        <div 
          key={i} 
          className="flex-shrink-0 w-36  sm:w-40 animate-pulse"
        >
          {type === 'product' ? (
            <div className="flex flex-col gap-2">
              <div className="aspect-square bg-gray-200 rounded-xl mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="aspect-square bg-gray-200 rounded-xl w-full"></div>
              <div className="h-4 bg-gray-200 rounded mt-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mt-1 w-1/2"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const GridSkeletonLoader = ({ 
  count = 4,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
};


// ProductListSkeleton.jsx
export const ProductListSkeleton = () => (
  <div className="flex flex-row gap-4 bg-[#fff]">
    <div className="hidden lg:flex w-1/4">
      <FilterSkeleton />
    </div>
    
    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
          <div className="bg-gray-200 h-48 w-full" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);


export const OrderListSkeleton = () => (
  <div className="flex flex-row gap-4 bg-[#fff]">
    
    
    <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow animate-pulse">
          <div className="bg-gray-200 h-48 w-full" />
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// FilterSkeleton.jsx
export const FilterSkeleton = () => (
  <div className="w-full p-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, j) => (
            <div key={j} className="flex items-center">
              <div className="h-5 w-5 bg-gray-200 rounded mr-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);


export const EmptyState = ({handleClearAll}) => (
  <div className="w-full text-center py-12">
    <div className="mx-auto max-w-md">
      <SearchIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-lg font-medium text-gray-900">No products found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filter to find what you're looking for.
      </p>
      <div className="mt-6">
        <button
          onClick={handleClearAll}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-700 hover:bg-cyan-800 focus:outline-none"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  </div>
);






export const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-[64px] min-w-[64px] relative rounded-full">
      <div className="wifi-loader">
        <svg 
          viewBox="0 0 86 86" 
          className="circle-outer absolute h-[86px] w-[86px] flex justify-center items-center"
        >
          <circle 
            r={40} 
            cy={43} 
            cx={43} 
            className="circle-back fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round rotate-[-100deg] origin-center stroke-[#c3c8de]"
          />
          <circle 
            r={40} 
            cy={43} 
            cx={43} 
            className="circle-front fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round rotate-[-100deg] origin-center stroke-[#3390ca]"
          />
          <circle 
            r={40} 
            cy={43} 
            cx={43} 
            className="circle-new fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round rotate-[-100deg] origin-center stroke-[#3390ca]"
          />
        </svg>
        
        <svg 
          viewBox="0 0 60 60" 
          className="circle-middle absolute h-[60px] w-[60px] flex justify-center items-center"
        >
          <circle 
            r={27} 
            cy={30} 
            cx={30} 
            className="circle-back fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round rotate-[-100deg] origin-center stroke-[#c3c8de]"
          />
          <circle 
            r={27} 
            cy={30} 
            cx={30} 
            className="circle-front fill-none stroke-[6px] stroke-linecap-round stroke-linejoin-round rotate-[-100deg] origin-center stroke-[#969600]"
          />
        </svg>
        
        <div 
          data-text="Loading..." 
          className="text absolute bottom-[-40px] flex  text-[#1c6468] justify-center items-center lowercase font-medium text-sm tracking-[0.2px]"
        />
      </div>
    </div>
  );
}



export const ChatMessageSkeleton = () => (
  <div className="w-full h-full flex flex-col gap-3 p-3">
    {[...Array(10)].map((_, index) => (
      <div 
        key={index} 
        className={cn(
          'flex',
          index % 2 === 0 ? 'justify-start' : 'justify-end'
        )}
      >
        <div className="flex items-start gap-2 max-w-[80%]">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
          <div className="flex flex-col gap-1">
            <div className="h-6 bg-gray-300 rounded w-48"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);


export const ChatListSkeleton = () => (
  <div className="w-full flex flex-col py-4 h-[400px] text-black">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="flex gap-5 justify-start items-center py-2 pl-2 animate-pulse">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
        <div className="flex flex-col w-full pr-8 gap-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="h-3 bg-gray-300 rounded w-4"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);


export const CategorySkeletonLoader = ({ count = 10 }) => {
  return (
    <div className="carousel carousel-horizontal flex flex-row gap-3 sm:gap-5 w-full justify-between px-1">
      {Array(count).fill(0).map((_, i) => (
        <div 
          key={i} 
          className="carousel-item flex flex-col items-center justify-center gap-2 animate-pulse"
        >
          <div className="h-16 w-16 sm:h-20 sm:w-20 2xl:h-28 2xl:w-28 rounded-full bg-gray-200" />
          
          <div className="h-3 w-12 sm:w-16 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
};
