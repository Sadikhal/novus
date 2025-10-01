import { Outlet } from 'react-router-dom'
import RightDashboard from '../../components/sections/RightDashboard'
import DashboardMenu from '../../components/sections/DashboardMenu';

const CustomerDashboard = () => {
  return (
    <div className="bg-[#909c80] mt-5 ">
      <div className="max-w-7xl mx-auto pt-5 px-4">
        <div className="py-0 flex flex-col lg:flex-row gap-6 relative">
          <div className="hidden lg:block w-[230px] flex-shrink-0 sticky top-6 self-start">
            <DashboardMenu />
          </div>
          <main className="flex-1 min-w-0">
            <div className="w-full">
              <RightDashboard />
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
