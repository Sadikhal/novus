import { cn } from "../../lib/utils";

export const Loader = () => (
  <div className="flex justify-center items-center min-h-[70vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0E6472]"></div>
  </div>
);

export const ErrorFallback = ({ message }) => (
  <div className="text-center flex items-center justify-center flex-col w-full p-6 font-poppins">
    <h2 className="text-2xl font-semibold text-red-700 mb-4">Error</h2>
    <p className="text-red-900 mb-4">{message || 'some thing went wrong, please try again'}</p>
  </div>
);

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