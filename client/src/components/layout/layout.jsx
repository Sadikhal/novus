import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

function Layout() {
  const location = useLocation();
  const isChatPage = location.pathname.includes('/dashboard/chat');

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <Outlet />
      </div>
      {!isChatPage && (
        <div>
          <Footer />
        </div>
      )}
    </div>
  );
}

export default Layout;