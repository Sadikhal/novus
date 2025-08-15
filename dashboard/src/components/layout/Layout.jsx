import  { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Menu from './Menu';
import Navbar from './Navbar';
import Mobilenav from '../../components/MobileNav';

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="h-full flex">
      {/* LEFT */}
      <div className={`
        ${open ? "w-[14%] lg:w-[16%] xl:w-[14%]" : "lg:w-[16%] w-[14%] sm:[6%] md:w-[10%] "}
        p-4 
      `}>
        <Mobilenav open={open} setOpen={setOpen} />
        <Menu open={open} setOpen={setOpen} />
      </div>
      {/* RIGHT */}
      <div className="w-[90%] sm:w-[94%] md:w-[90%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] flex flex-col overflow-x-hidden">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;