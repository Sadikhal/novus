

import { useSelector } from "react-redux";
import OrderTable from "../components/OrderTable";
import useOrderData from "../hooks/useOrderData";
import { Loader } from "../components/ui/Loaders";
import BrandsPerformance from '../components/stats/brandsPerfomanceChart';
import BrandRevenuePerfomanceChart from '../components/stats/BrandRevenuePerfomance';
import ProductsSoldChart from '../components/stats/TotalProductChart';
import BrandPerformanceChart from "../components/stats/BrandPerfomanceChart";

const Orders = () => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  
  const {
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    updateOrder,
    handleDelete,
    sortOrder
  } = useOrderData(role);


  
  return (
    <div className='flex flex-col gap-3'>
      <div>
        {loading ? <Loader/> : (
          <OrderTable 
            filteredData={filteredData}
            error={error}
            loading={loading}
            handleSearch={handleSearch}
            handleSort={handleSort}
            handleDelete={handleDelete}
            updateOrder={updateOrder}
            sortOrder={sortOrder}
            role={role}
          />
        )}
      </div>
        {
          currentUser.isAdmin ? (
            <div className="flex flex-col gap-3">
             <div className="w-full h-[700px]">
              <BrandsPerformance/>
                </div>
                <div className="w-full h-[700px]">
                  <BrandRevenuePerfomanceChart/>
                </div>
                <div className="w-full h-[700px]">
                  <ProductsSoldChart/>
                </div>
            </div>
          ):
          (
            <div className="w-full h-[700px]">
              <BrandPerformanceChart  brandId = {currentUser?.brand?._id}/>
            </div>
          )
        }
    </div>
  );
};

export default Orders;