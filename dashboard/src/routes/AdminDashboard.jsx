import { useDashboardStats } from "../hooks/useDashboardStats";
import Announcements from "../components/Announcements";
import CountChart from "../components/stats/CountChart";
import EventCalendar from "../components/EventCalendar";
import FinanceChart from "../components/stats/FinanceChart";
import ProfitChart from "../components/stats/ProfitChart";
import BrandPerformanceChart from "../components/stats/brandsChart";
import BrandsPerformance from "../components/stats/brandsPerfomanceChart";
import UserCard from "../components/UserCard";
import PerformanceChart from "../components/stats/Dailyperfomance";
import { ErrorFallback, Loader } from "../components/ui/Loaders";

const AdminDashboard = () => {
  const { stats, loading, error } = useDashboardStats();

  return (
    <div className="w-full h-full p-4 overflow-auto">
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {loading ? (
            <Loader/>
          ) : error ? (
            <ErrorFallback message={error}/>
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
          <div className="flex gap-4 flex-col lg:flex-row">
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart />
            </div>
            <div className="w-full lg:w-2/3 h-[450px]">
              <PerformanceChart />
            </div>
          </div>
          
          <div className="w-full h-[600px]">
            <FinanceChart />
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
          <Announcements/>
        </div>
      </div>
                  
      <div className="flex flex-col gap-5 mt-8">
        <div className="w-full h-[500px]">
          <BrandPerformanceChart/>
        </div>
        <div className="w-full h-[700px]">
          <BrandsPerformance/>
        </div>
        <div className="w-full h-[500px]">
          <ProfitChart />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;