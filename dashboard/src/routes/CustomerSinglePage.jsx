
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import FormModal from "../components/FormModal";
import OrderTable from "../components/OrderTable";
 import CustomerPerformanceChart from "../components/stats/CustomerPerformanceChart";
import { Loader, ErrorFallback } from "../components/ui/Loaders";
import useCustomerData from "../hooks/useCustomerData";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import useOrderData from "../hooks/useOrderData";

const SingleCustomerPage = () => {
  const { id } = useParams();
    const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  const {
    customer,
    orders,
    stats,
    filteredOrders,
    error,
    loading,
    sortOrder,
    fetchCustomer,
    updateCustomer,
    handleSearchOrders,
    handleSort,
    setSortOrder,
     updateLocalOrder,
    deleteLocalOrder
  } = useCustomerData();
  const {
      updateOrder: apiUpdateOrder,
      handleDelete: apiHandleDelete
    } = useOrderData(role);

  useEffect(() => {
    if (id) {
      fetchCustomer(id);
    }
  }, [id, sortOrder]);

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

    
    const address = useMemo(() => 
     customer?.addresses?.find(addr => addr?._id === customer?.defaultAddress),
    [customer]
  );

 if (error) return <div className="w-full flex  h-full items-center justify-center">
    <ErrorFallback error={error} />
  </div>;
  if (loading || !customer) return <Loader />;
  return (
    <div className="flex-1 sm:p-4 p-1 xs:p-2 flex flex-col gap-4">
      {/* Customer Info Section */}
      <div className="flex w-full flex-col lg:flex-row gap-4">
        {/* Customer Info Card */}
        <div className="bg-lamaSky py-6 sm:px-4 px-1 rounded-md flex-1 flex sm:gap-4 xs:gap-2 gap-1">
          <div className="sm:w-1/3 w-1/6">
            <img
              src={customer?.image || "/images/avatar.png"}
              alt="customer"
              className="sm:w-36 sm:h-36 h-12 w-12 rounded-full object-cover"
            />
          </div>
          <div className="w-2/3 flex flex-col justify-between gap-4 text-lamaWhite">
            <div className="flex items-center gap-4">
              <h1 className="sm:text-xl text-md font-semibold capitalize text-black">{customer?.name}</h1>
              <FormModal
                table="customer"
                type="update"
                data={customer}
                onSuccess={(data) => updateCustomer(id, data)}
              />
            </div>
             {address &&(
          <div>
           <p className="text-sm text-gray-200 font-poppins capitalize">
                    {address?.name} {address?.address1}, {address?.address2}, {address?.state}, {address?.city}-{address?.pincode}
            </p>
             <p className="text-lamaWhite text-sm font-medium tracking-wider font-poppins capitalize">
              {address?.number} 
            </p>
          </div>
             )}
            <div className="flex flex-col gap-2 text-xs font-medium text-[#0d0b0b] capitalize">
              <div className="flex flex-row items-center">
                <span className="font-medium sm:semibold sm:text-[13px] text-[10px] text-nowrap">Customer ID:</span>
                <span className="sm:text-[13px] text-[10px] md:ml-3 sm:ml-2 xs:ml-1 ml-0">{customer._id}</span>
              </div>
              <div className="flex flex-row items-center ">
                <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Joined At:</span>
                <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0">
                  {format(parseISO(customer.createdAt), 'MM/dd/yy')}
                </span>
              </div>
              <div className="flex flex-row items-center">
                <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Email:</span>
                <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0">{customer.email}</span>
              </div>
              <div className="flex flex-row items-center">
                <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Phone:</span>
                <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0 capitalize">{customer?.number || "N/A"}</span>
              </div>
              {customer.dateOfBirth && (
                <div className="flex flex-row items-center">
                  <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Date of Birth:</span>
                  <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0">
                    {format(parseISO(customer.dateOfBirth), 'MM/dd/yy')}
                  </span>
                </div>
              )}
              <div className="flex flex-row items-center">
                  <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Role :</span>
                  <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0">
                    {customer.role}
                  </span>
                </div>
              <div className="flex flex-row items-center">
                  <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Is Verified :</span>
                  <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0">
                    {customer.isVerified ? "yes" : "No"}
                  </span>
                </div>
              <div className="flex flex-row items-center">
                <span className="font-medium sm:semibold sm:text-[13px] text-[11px] text-nowrap">Last Login:</span>
                <span className="sm:text-[13px] text-[11px] md:ml-3 sm:ml-2 ml-0">
                  {customer.lastLogin ? format(parseISO(customer.lastLogin), 'MM/dd/yy') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="flex-1 flex gap-2 justify-between flex-wrap font-poppins">
          <div className="bg-white p-4 rounded-md flex gap-2 lg:justify-center lg:items-center w-full md:w-[48%] xl:w-[49%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
            <img src="/images/products1.png" alt="" className="w-16 h-16" />
            <div>
              <h1 className="text-xl font-semibold">
                {stats?.totalProducts || 0}
              </h1>
              <span className="text-sm text-gray-400">Total Products Ordered</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md flex gap-2 lg:justify-center lg:items-center  w-full md:w-[48%] xl:w-[48%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
            <img src="/images/pendingcart.png" alt="" className="w-16 h-16" />
            <div>
              <h1 className="text-xl font-semibold">
                {stats?.todayOrders || 0}
              </h1>
              <span className="text-sm text-gray-400">Today's Orders</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md flex gap-2 lg:justify-center lg:items-center  w-full md:w-[48%] xl:w-[48%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
            <img src="/images/Company Revenue.png" alt="" className="w-16 h-16" />
            <div>
              <h1 className="text-xl font-semibold">
                ₹{(stats?.totalRevenue || 0).toLocaleString()}
              </h1>
              <span className="text-sm text-gray-400">Total Revenue</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md flex gap-2 lg:justify-center lg:items-center  w-full md:w-[48%] xl:w-[49%] 2xl:w-[48%] cursor-pointer hover:bg-slate-100">
            <img src="/images/pendingCart2.png" alt="profit" className="w-16 h-16" />
            <div>
              <h1 className="text-xl font-semibold">
               ₹{(stats?.totalProfit || 0).toFixed(2)}
              </h1>
              <span className="text-sm text-gray-400">Total Profit</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="w-full pt-5">
        <OrderTable 
          filteredData={filteredOrders}
          error={error}
          loading={loading}
          handleSearch={handleSearchOrders}
          handleSort={handleSort}
          sortOrder={sortOrder}
          role={role}
          handleDelete={handleDeleteOrder}
          updateOrder={handleUpdateOrder}
        />
      </div>
      
      {/* Performance Chart */}
      <div className="w-full sm:h-[700px] h-[800px]">
        <CustomerPerformanceChart customerId={id}/>
      </div>
    </div>
  );
};

export default SingleCustomerPage;