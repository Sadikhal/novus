import { ScrollArea, ScrollBar } from './ui/ScrollArea'
import ListingCards from './ListingCards'

const HomeProducts = ({ listings, type, title ,priority}) => {
  const bannerType = type === "product" ? "products" : "categories";
  return (
    <>
    <div className='flex flex-col sm:flex-row gap-1 sm:items-center'>
       <div className='md:text-[23px] sm:text-[20px] text-[18px]  font-assistant font-bold  text-slate-900 p-2 capitalize'>
        {title}
      </div>
       <div className='text-[12px] bg-[#fff] font-poppins font-bold  text-cyan-800  px-2  shadow-sm flex shadow-teal-200 rounded-sm sm:items-center sm:justify-center sm:w-auto w-min mb-3 ml-2 sm:ml-0 sm:mb-0'>
       {priority}
      </div>
    </div>
     
     { priority === "secondary" && 
      <div className='text-[12px] font-assistant font-bold  text-[#4e1c1c] px-2 capitalize'>
       *  user can see only first four {bannerType} 
      </div>
}
      <ScrollArea 
        orientation="horizontal" 
        className="w-full px-2 bg-[#fffbfb] py-4"
      >
        <div className="flex flex-nowrap gap-4 pb-4">
          {listings?.map((listing, index) => (
            <div key={index} className="flex-shrink-0 w-36 md:w-48 sm:w-40">
              <ListingCards
                data={listing}
                type={type}
              />
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  )
}

export default HomeProducts;