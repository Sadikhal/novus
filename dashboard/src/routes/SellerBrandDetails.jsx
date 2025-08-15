import { useEffect } from 'react'
import useSellerData from '../hooks/useSellerData';
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import { Loader, ErrorFallback } from "../components/ui/Loaders";
import FormModal from "../components/FormModal";
import Performance from '../components/Perfomance';
import BrandPerformanceChart from '../components/stats/BrandPerfomanceChart';


const BrandDetails = () => {
  const { currentUser } = useSelector((state) => state.user);
  const id  = currentUser.brand._id ;
  const {
      brand,
      stats,
      rating,
      error,
      loading,
      fetchBrand,
      updateBrand,
    } = useSellerData();


  useEffect(() => {
    if (id) {
      fetchBrand(id);
    }
  }, [id]);

  if (loading || !brand) return <Loader />;
  if (error) return <div className="w-full items-center justify-center flex">
    <ErrorFallback error={error} />
  </div> 
  return (
    <div className="flex-1 p-4 flex-col">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-4">
        <div className="w-full">
          {/* TOP */}
          <div className="flex flex-col">
            <div className="flex w-full flex-col lg:flex-row gap-4">
              {/* BRAND INFO CARD */}
              <div className="bg-lamaSky py-6 px-1 sm:px-4 rounded-md flex-1 flex flex-col sm:gap-4 xs:gap-2 gap-1">
               <div className='w-full flex flex-row gap-2'>
                <div className="sm:w-1/3 w-1/4">
                  <img
                    src={brand?.image?.[0] || "/images/default-product.png"}
                    alt="brand"
                    className="sm:w-36 sm:h-36 w-[70px] h-[70px] rounded-full object-cover"
                  />
                </div>
                <div className="w-3/4 flex flex-col justify-center gap-2">
                  <div className="flex items-center pt-2 gap-4">
                    <h1 className="md:text-xl text-md font-semibold capitalize">{brand?.name}</h1>
                     <FormModal
                      table="seller"
                      data={brand}
                      type="update"
                      onSuccess={(data) => updateBrand(id, data)}
                    />
                  </div>
                  <p className="text-sm text-gray-200 font-poppins">
                    {[brand.address1, brand.address2, brand.state, brand.city, brand.pincode]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                </div>
                </div>    
                  <div className="flex gap-2 flex-col text-xs font-medium font-poppins px-3 pt-3">
                    <div className="flex  flex-row items-center text-[12px]">
                  <span className="font-medium sm:semibold sm:text-[13px]  text-[11px] text-nowrap">Seller Name :</span>
                  <span className="sm:text-[13px] text-[11px]  capitalize  md:ml-3  sm:ml-2 ml-0"> { brand.sellerName }</span>
                </div>
                <div className="flex  flex-row items-center">
                  <span className="font-medium sm:semibold sm:text-[13px]  text-[11px] text-nowrap">Seller ID :</span>
                  <span className="sm:text-[13px] text-[11px]  capitalize md:ml-3  sm:ml-2 ml-0"> {brand.sellerId }</span>
                </div>
               
                    <div className="flex flex-row items-center text-[12px]">
                      <span className="font-medium sm:semibold sm:text-[13px]  text-[11px] text-nowrap">Brand ID :</span>
                      <span className="sm:text-[13px] text-[10px]  capitalize md:ml-3  sm:ml-2 ml-0"> {brand._id}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-medium sm:semibold sm:text-[13px]  text-[11px] text-nowrap">Brand Launched :</span>
                      <span className="sm:text-[13px] text-[11px]  capitalize md:ml-3  sm:ml-2 ml-0">{format(parseISO(brand.createdAt),'MM/dd/yy')}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-medium sm:semibold sm:text-[13px]  text-[11px] text-nowrap">Email ID :</span>
                      <span className="sm:text-[13px] text-[11px]  capitalize md:ml-3  sm:ml-2 ml-0"> {brand.email}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-medium sm:semibold sm:text-[13px]  text-[11px] text-nowrap">Phone Number :</span>
                      <span className="sm:text-[13px] text-[11px]  md:ml-3  sm:ml-2 ml-0 capitalize">{brand?.number}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-medium sm:semibold sm:text-[13px]  text-[11px] text-nowrap">Experience :</span>
                      <span className="sm:text-[13px] text-[11px]  capitalize md:ml-3  sm:ml-2 ml-0"> {brand.experience}</span>
                    </div>
                  </div>
               
              </div>
              
              {/* SMALL CARDS */}
              <div className="flex-1 flex gap-2 justify-between flex-wrap font-poppins">
                <div className="bg-white p-4 px-2  rounded-md flex gap-2 w-full md:w-[48%] xl:w-[49%] 2xl:w-[48%] items-center justify-center  cursor-pointer hover:bg-slate-100">
                  <img src="/images/products1.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">
                      {stats?.total?.products || 0}
                    </h1>
                    <span className="text-sm text-gray-400">Total Products</span>
                  </div>
                </div>

                <div className="bg-white p-4 items-center justify-center  rounded-md flex gap-2 w-full md:w-[48%] xl:w-[48%] 2xl:w-[48%] px-1 cursor-pointer hover:bg-slate-100">
                  <img src="/images/Company Revenue.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">
                      ${(stats?.total?.revenue || 0).toLocaleString()}
                    </h1>
                    <span className="text-sm text-gray-400">Total Revenue</span>
                  </div>
                </div>

                <div className="bg-white p-4 items-center justify-center   rounded-md flex gap-2 w-full md:w-[48%] xl:w-[48%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
                  <img src="/images/pendingCart2.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">
                      {stats?.total?.productsSold || 0}
                    </h1>
                    <span className="text-sm text-gray-400">Total Product Sales</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md flex gap-2 w-full items-center justify-center md:w-[48%] xl:w-[49%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
                  <img src="/images/pendingcart.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">
                      ${(stats?.total?.profit || 0).toFixed(2)}
                    </h1>
                    <span className="text-sm text-gray-400">Total Profits</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      {/* RIGHT */}
      <div className="w-full flex flex-col gap-4">
        <Performance rating={rating?.averageRating || 0}/>
    </div>
    <div className="w-full pt-12 h-[800px]">
          <BrandPerformanceChart brandId={brand._id}/>
        </div>
    </div>
  )
}

export default BrandDetails