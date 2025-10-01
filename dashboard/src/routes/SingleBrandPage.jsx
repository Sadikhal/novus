import { useParams } from "react-router-dom";
import { useEffect } from "react";
import useSellerData from "../hooks/useSellerData";
import FormModal from "../components/FormModal";
import ProductTable from "../components/ProductTable";
import OrderTable from "../components/OrderTable";
import Performance from "../components/Perfomance";
import BrandPerformanceChart from "../components/stats/BrandPerfomanceChart";
import BrandProductRevenuePerformance from "../components/stats/SingleBrandRevenueChart";
import BrandProductsSalesChart from "../components/stats/SingleBrandSalesChart";
import { Loader, ErrorFallback } from "../components/ui/Loaders";
import useOrderData from "../hooks/useOrderData";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";

const SingleBrandPage = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  
  const {
    brand,
    products,
    orders,
    stats,
    rating,
    filteredProducts,
    filteredOrders,
    error,
    loading,
    sortOrder,
    fetchBrand,
    updateBrand,
    handleSearchProducts,
    handleSearchOrders,
    handleSort,
    setSortOrder,
    updateLocalOrder,
    deleteLocalOrder
  } = useSellerData();

  const {
    updateOrder: apiUpdateOrder,
    handleDelete: apiHandleDelete
  } = useOrderData(role);
  
  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      const updatedOrder = await apiUpdateOrder(orderId, updatedData);
      if(updatedOrder) {
        updateLocalOrder(orderId, updatedOrder);
      }
      return updatedOrder;
    } catch (error) {
      console.error("Error updating order:", error);
      throw error;
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const success = await apiHandleDelete(orderId);
      if(success) {
        deleteLocalOrder(orderId);
      }
      return success;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (id) {
      fetchBrand(id);
    }
  }, [id, sortOrder]);


  if (error) return <div className="w-full items-center justify-center flex">
    <ErrorFallback message={error} />
  </div> 
  if (loading || !brand) return <Loader />;

  return (
    <div className="overflow-x-hidden p-2 sm:p-3 md:p-4 flex h-full flex-col">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-4">
        <div className="w-full">
          {/* TOP */}
          <div className="flex flex-col">
            <div className="flex w-full flex-col lg:flex-row gap-4">
              {/* BRAND INFO CARD */}
              <div className="bg-lamaSky py-6 px-1 sm:px-4 rounded-md flex-1 flex sm:gap-4 xs:gap-2 gap-1">
                <div className="sm:w-1/3 w-1/6">
                  <img
                    src={brand.image?.[0] || '/images/default-product.png'}
                    alt="brand"
                    className="sm:w-36 sm:h-36  h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div className="w-2/3 flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h1 className="md:text-xl text-md font-semibold capitalize">{brand?.name}</h1>
                    {role === "admin" && <FormModal
                      table="seller"
                      data={brand}
                      type="update"
                      onSuccess={(data) => updateBrand(id, data)}
                    />}
                  </div>
                  <p className="text-sm text-gray-200 font-poppins">
                    {[brand.address1, brand.address2, brand.state, brand.city, brand.pincode]
                      .filter(Boolean)
                      .join(', ')}
                  </p>
                  <div className="flex gap-2 flex-col text-xs font-medium font-poppins ">
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
              </div>
              
              {/* SMALL CARDS */}
              <div className="flex-1 flex gap-2 justify-between flex-wrap font-poppins">
                <div className="bg-white p-4 px-2 rounded-md flex lg:justify-center lg:items-center gap-2 w-full md:w-[48%] xl:w-[49%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
                  <img src="/images/products1.png" alt="product" className="w-16 h-16 xl:w-16 xl:h-16 lg:w-12 lg:h-12" />
                  <div>
                    <h1 className="lg:text-base text-xl xl:text-xl font-semibold">
                      {stats?.total?.products || 0}
                    </h1>
                    <span className="text-sm text-gray-500   font-normal font-poppins">Total Products</span>
                  </div>
                </div>

                <div className="bg-white p-4 xl:p-4 lg:p-2 rounded-md flex lg:gap-1 gap-2 xl:gap-2 lg:justify-center lg:items-center   w-full md:w-[48%] xl:w-[48%] 2xl:w-[48%] px-1 cursor-pointer hover:bg-slate-100">
                  <img src="/images/Company Revenue.png" alt="company" className="w-16 h-16 xl:w-16 xl:h-16 lg:w-12 lg:h-12" />
                  <div>
                    <h1 className="lg:text-base text-xl xl:text-xl font-semibold">
                      ₹{(stats?.total?.revenue || 0).toLocaleString()}
                    </h1>
                    <span className="text-sm text-gray-500   font-normal font-poppins ">Total Revenue</span>
                  </div>
                </div>

                <div className="bg-white p-4 xl:p-4 lg:p-2 lg:justify-center lg:items-center  rounded-md flex lg:gap-1 gap-2 xl:gap-2  w-full md:w-[48%] xl:w-[48%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
                  <img src="/images/pendingCart2.png" alt="" className="w-16 h-16 xl:w-16 xl:h-16 lg:w-12 lg:h-12" />
                  <div>
                    <h1 className="lg:text-base text-xl xl:text-xl font-semibold">
                      {stats?.total?.productsSold || 0}
                    </h1>
                    <span className="text-sm text-gray-500   font-normal font-poppins">Total Product Sales</span>
                  </div>
                </div>

                <div className="bg-white p-4 xl:p-4 lg:p-2 rounded-md flex lg:justify-center lg:items-center lg:gap-1 gap-2 xl:gap-2 w-full md:w-[48%] xl:w-[49%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
                  <img src="/images/pendingcart.png" alt="" className="w-16 h-16 xl:w-16 xl:h-16 lg:w-12 lg:h-12" />
                  <div>
                    <div className="lg:text-base text-xl xl:text-xl font-semibold ">
                      ₹{(stats?.total?.profit || 0).toFixed(2)}
                    </div>
                    <span className="text-sm text-gray-500   font-normal font-poppins">Total Profits</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="w-full pt-5 h-full">
              <ProductTable 
                productsData={products} 
                loading={loading} 
                setSortOrder={setSortOrder}
                error={error} 
                handleSearch={handleSearchProducts}
                filteredData={filteredProducts}
                role={role}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* RIGHT */}
      <div className="w-full h-full flex flex-col gap-4">
        <Performance rating={rating?.averageRating || 0}/>
        
        <div className="w-full pt-5 xl:hidden">
          <OrderTable 
            filteredData={filteredOrders}
            error={error}
            loading={loading}
            handleSearch={handleSearchOrders}
            handleSort={handleSort}
            sortOrder={sortOrder}
            handleDelete={handleDeleteOrder}
            updateOrder={handleUpdateOrder}
            role={role}
          /> 
        </div>
        
        <div className="w-full h-auto">
          <BrandPerformanceChart brandId={brand._id}/>
        </div>
      </div>
      
      <div className="w-full h-full pt-5 hidden xl:block">
        <OrderTable 
          filteredData={filteredOrders}
          error={error}
          loading={loading}
          handleSearch={handleSearchOrders}
          handleSort={handleSort}
          sortOrder={sortOrder}
          handleDelete={handleDeleteOrder}
          updateOrder={handleUpdateOrder}
          role={role}
        />
      </div>
       <div className="w-full h-full">
          <BrandProductRevenuePerformance brandId={brand._id} brandName={brand?.name}/>
        </div>

        <div className="w-full pt-3 h-full">
          <BrandProductsSalesChart brandId={brand._id}/>
        </div>
    </div>
  );
};

export default SingleBrandPage;