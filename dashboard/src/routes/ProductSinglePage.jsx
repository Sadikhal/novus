import React from 'react';
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { format, parseISO } from "date-fns";
import useProductData from '../hooks/useProductData';
import useOrderData from "../hooks/useOrderData";
import ProductCard from "../components/ProductCard";
import OrderTable from '../components/OrderTable';
 import SingleProductPerformance from "../components/stats/SingleProductPerfomance";
import ProductDetailsTable from "../components/ProductDetailsTable"; import Performance from "../components/Perfomance";
import { Loader, ErrorFallback } from "../components/ui/Loaders";
import { ScrollArea } from '../components/ui/ScrollArea';

const ProductSinglePage = () => {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  
  const {
    product,
    brand,
    orders,
    filteredOrders,
    stats,
    loading,
    error,
    sortOrder,
    updateProduct,
    setSortOrder,
    fetchProductData,
    handleSearchOrders,
    updateLocalOrder,
    deleteLocalOrder
  } = useProductData();

  const {
    updateOrder: apiUpdateOrder,
    handleDelete: apiHandleDelete
  } = useOrderData(role);

  React.useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id, sortOrder, fetchProductData]);

  const handleUpdateOrder = async (orderId, updatedData) => {
    try {
      const updatedOrder = await apiUpdateOrder(orderId, updatedData);
      if (updatedOrder) {
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
      if (success) {
        deleteLocalOrder(orderId);
      }
      return success;
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };

  

  // Handler to remove image from product
  const handleRemoveImage = async (imgIndex) => {
    if (!product || !product.image) return;
    const newImages = product.image.filter((_, idx) => idx !== imgIndex);
    try {
      await updateProduct(product._id, { ...product, image: newImages });
      fetchProductData(product._id); // Refresh product data
    } catch (err) {
      console.error('Failed to remove image:', err);
    }
  };

  
  if (loading || !product) return <Loader />;
  if (error) return <ErrorFallback error={error} />;
  return (
    <div className="flex-1 p-2 sm:p-3 md:p-4 flex-col overflow-x-hidden">
      {/* LEFT */}
      <div className="flex w-full flex-col gap-4">
        <div className="w-full">
          {/* TOP */}
          <div className="flex flex-col">
            <div className="flex w-full flex-col lg:flex-row gap-4">
              {/* PRODUCT INFO CARD */}
              <div className="bg-lamaSky py-6 px-2  rounded-md flex-1 flex sm:gap-4 xs:gap-2 gap-1">
                <div className="sm:w-1/3 w-1/6">
                  <img
                    src={product.image?.[0] || '/images/default-product.png'}
                    alt="product"
                    className="sm:w-36 sm:h-36 h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div className="w-2/3 flex flex-col justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <h1 className="md:text-xl text-md font-semibold capitalize font-poppins">{product.name}</h1>
                    <Link 
                      to={`/${role}/update-product/${product._id}`}
                      className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer bg-cyan-700"
                    >
                      <img 
                        src="/images/update.png" 
                        alt="update" 
                        className="bg-transparent w-4 h-4"
                      />
                    </Link>
                  </div>
                  <div className="flex gap-2 flex-col text-xs font-medium font-poppins ">
                    <div className="flex flex-row items-center text-[12px]">
                      <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Seller ID :</span>
                      <span className="sm:text-[13px] text-[11px] capitalize md:ml-3 sm:ml-2 ml-0">{product.userId}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Brand :</span>
                      <span className="sm:text-[13px] text-[11px] capitalize md:ml-3 sm:ml-2 ml-0">{brand?.name}</span>
                    </div>
                    <div className="flex flex-row items-center text-[12px]">
                      <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Brand ID :</span>
                      <span className="sm:text-[13px] text-[10px] capitalize md:ml-3 sm:ml-2 ml-0">{brand?._id}</span>
                    </div>
                    <div className="flex flex-row items-center">
                      <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Launched At :</span>
                      <span className="sm:text-[13px] text-[11px] capitalize md:ml-3 sm:ml-2 ml-0">{format(parseISO(product.createdAt), 'MM/dd/yyyy')}</span>
                    </div>
                    {brand?.email && (
                      <div className="flex flex-row items-center">
                        <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Email :</span>
                        <span className="sm:text-[13px] text-[11px] capitalize md:ml-3 sm:ml-2 ml-0">{brand.email}</span>
                      </div>
                    )}
                    {brand?.number && (
                      <div className="flex flex-row items-center">
                        <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Phone :</span>
                        <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0 capitalize">{brand?.number}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* SMALL CARDS */}
              <div className="flex-1 flex gap-2 justify-between flex-wrap">
                <div className="bg-white p-4 rounded-md flex gap-2 w-full md:w-[48%] cursor-pointer lg:justify-center lg:items-center hover:bg-slate-100">
                  <img src="/images/pendingCart2.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">{stats?.totalSales || 0}</h1>
                    <span className="text-sm text-gray-400">Total Product Sales</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md flex gap-2 w-full md:w-[48%] cursor-pointer lg:justify-center lg:items-center hover:bg-slate-100">
                  <img src="/images/pendingCart2.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">
                      ₹{stats?.totalProfit?.toFixed(2) || 0}
                    </h1>
                    <span className="text-sm text-gray-400">Total Profits</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md flex gap-2 w-full md:w-[48%] cursor-pointer lg:justify-center lg:items-center  hover:bg-slate-100">
                  <img src="/images/Company Revenue.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">
                      ₹{stats?.totalRevenue?.toFixed(2) || 0}
                    </h1>
                    <span className="text-sm text-gray-400">Revenue</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md flex gap-2 w-full md:w-[48%] cursor-pointer lg:justify-center lg:items-center  hover:bg-slate-100">
                  <img src="/images/pendingcart.png" alt="" className="w-16 h-16" />
                  <div>
                    <h1 className="text-xl font-semibold">{stats?.todaySales || 0}</h1>
                    <span className="text-sm text-gray-400">Today Sales</span>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT IMAGES */}
            <div className="w-full pt-5">
              <ScrollArea className="w-full" orientation="horizontal">
                <div className="flex flex-row gap-4 pb-4 min-w-max">
                  {product.image?.map((img, i) => (
                    <div key={i} className="flex-shrink-0 w-32 sm:w-48 ">
                      <ProductCard 
                        data={img} 
                        productId={product._id} 
                        onRemoveImage={() => handleRemoveImage(i)}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            
            {/* PRODUCT DETAILS */}
            <div className="w-full pt-5 flex flex-col gap-2">
              <ProductDetailsTable product={product} brand={brand} />
             <div className="p-3 whitespace-pre-line break-words py-3 ">
                <div className="font-semibold text-xl font-poppins w-full ">
                 Product Description :
                </div>
                {product.desc && product.desc.trim() !== '' ? (
                  <div
                    className="mt-6 prose w-full font-poppins"
                    dangerouslySetInnerHTML={{ __html: product.desc }}
                  />
                ) : 'No description provided'}
              </div>
          </div>
          </div>
        </div>
        
        {/* RIGHT */}
        <div className="w-full flex flex-col gap-4">
          <Performance rating={product.rating} />
          <div className="w-full pt-5 xl:hidden">
            <OrderTable 
              orderData={orders}
              filteredData={filteredOrders}
              setFilteredData={handleSearchOrders}
              setOrderData={updateLocalOrder}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              handleDelete={handleDeleteOrder}
              updateOrder={handleUpdateOrder}
            />
          </div>
        </div>
      </div>
      
      {/* BOTTOM SECTION - HIDDEN ON MOBILE */}
      <div className="w-full  pt-5 flex flex-col gap-4">
        <div className="w-full h-[800px] sm:h-[600px]">
          <SingleProductPerformance productId={id} />
        </div>
        <OrderTable 
          orderData={orders}
          filteredData={filteredOrders}
          setFilteredData={handleSearchOrders}
          setOrderData={updateLocalOrder}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          handleDelete={handleDeleteOrder}
          updateOrder={handleUpdateOrder}
        />
      </div>
    </div>
  );
};

export default ProductSinglePage;