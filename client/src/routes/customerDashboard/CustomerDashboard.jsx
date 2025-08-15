import { Outlet } from 'react-router-dom'
import RightDashboard from '../../components/sections/RightDashboard'
import DashboardMenu from '../../components/sections/DashboardMenu';

const CustomerDashboard = () => {
  
  return (
    <div className="bg-[#909c80] mt-5">
      <div className="mx-auto pt-5">
        <div className="py-0 flex md-lg:w-[90%] mx-auto relative">
          <div className="h-full hidden lg:block relative  lg:sticky lg:top-6 lg:self-start">
          <DashboardMenu />
        </div>
          <main className="lg:w-[calc(100%-230px)] w-full">
            <div className="mx-4 md-lg:mx-0">
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