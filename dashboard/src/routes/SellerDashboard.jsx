import { useEffect } from "react";
import { useSelector } from "react-redux";
import Announcements from "../components/Announcements";
import EventCalendar from "../components/EventCalendar";
import BrandPerformanceChart from "../components/stats/BrandPerfomanceChart";
import UserCard from "../components/UserCard";
import BrandProductRevenuePerformance from "../components/stats/SingleBrandRevenueChart";
import BrandProductsSalesChart from "../components/stats/SingleBrandSalesChart";
import Performance from "../components/Perfomance";
import useSellerData from "../hooks/useSellerData";
import { ErrorFallback, Loader } from "../components/ui/Loaders";

const SellerDashboard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { stats, fetchBrand, loading, error } = useSellerData();

  useEffect(() => {
    if (currentUser?.brand?._id) {
      fetchBrand(currentUser.brand._id);
    }
  }, [currentUser?.brand?._id]);

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {loading ? (
            <Loader />
          ) : error ? (
            <ErrorFallback message={error} />
          ) : (
            <>
              <div className="flex gap-4 justify-between flex-wrap">
                <UserCard 
                  type="Total Revenue" 
                  value={stats?.total?.revenue}
                  dateType="All Time"
                />
                <UserCard 
                  type="Total Products" 
                  value={stats?.total?.products}
                  dateType="All Time"
                />
                <UserCard 
                  type="Total Products Sales" 
                  value={stats?.total?.productsSold}
                  dateType="All Time"
                />
                <UserCard 
                  type="Total Profits" 
                  value={stats?.total?.profit}
                  dateType="All Time"
                />
              </div>

              <div className="flex gap-4 justify-between flex-wrap">
                <UserCard 
                  type="Today Revenue" 
                  value={stats?.today?.revenue}
                  dateType="Today"
                />
                <UserCard 
                  type="Today Products" 
                  value={stats?.today?.products}
                  dateType="Today"
                />
                <UserCard 
                  type="Today Products Sales" 
                  value={stats?.today?.productsSold}
                  dateType="Today"
                />
                <UserCard 
                  type="Today Profits" 
                  value={stats?.today?.profit}
                  dateType="Today"
                />
              </div>
            </>
          )}

          <div className="w-full flex flex-col gap-8">
            {currentUser?.brand?._id && (
              <>
                <div className="w-full h-full">
                  <BrandPerformanceChart brandId={currentUser.brand._id} />
                </div>

                <div className="w-full h-full">
                 <BrandProductRevenuePerformance brandId={currentUser.brand._id} />
               </div>

               
              </>
            )}
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
          <Announcements />
        </div>
      </div>

      {currentUser?.brand?._id && (
        <div className="flex flex-col gap-5 mt-8">
          {stats?.performance && (
            <Performance rating={stats.performance.averageRating || 0} />
          )}
          <div className="w-full h-full">
            <BrandProductsSalesChart brandId={currentUser.brand._id} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;