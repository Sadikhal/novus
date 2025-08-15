
import { Link, Outlet } from 'react-router-dom'
import { RxDashboard } from 'react-icons/rx'
import { PiChatCenteredDotsBold } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa6";
import { RiLockPasswordLine  } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { BiPurchaseTagAlt } from "react-icons/bi";
import { FiShoppingCart } from "react-icons/fi";
import { RiLogoutBoxRLine } from "react-icons/ri";



const DashboardMenu = () => {

  const menuItems = [
    { icon: <RxDashboard />, text: 'Dashboard', path: '/dashboard' },
    { icon: <BiPurchaseTagAlt />, text: 'My Orders', path: '/dashboard/my-orders' },
    { icon: <FaRegHeart />, text: 'Wishlist', path: '/dashboard/my-wishlist' },
    { icon: <PiChatCenteredDotsBold />, text: 'Chat', path: '/dashboard/chat' },
    { icon: <RiLockPasswordLine />, text: 'Change Password', path: '/forgot-password' },
    { icon: <ImProfile />, text: 'Profile', path: '/dashboard/profile' },
    { icon: <FiShoppingCart />, text: 'Cart', path: '/dashboard/cart' },
    { icon: <RiLogoutBoxRLine />, text: 'Logout', path: null, action: handleLogout }
  ];

  function handleLogout() {
    console.log('Logout clicked');
  }


return(
  <nav className="  rounded-md  z-50  h-min py-5 -left-4 lg:w-[230px] lg:ml-4 transition-all duration-300 bg-white w-full ">
  <ul className="py-2 text-slate-600 px-4 flex lg:flex-col lg:gap-2 gap-5 flex-wrap ">
  {menuItems.map((item, index) => (
    <li
      key={index}
      className="flex items-center gap-4 py-2 px-2 rounded-md min-w-48 hover:bg-white border-b-2 bg-[#fffefe] lg:min-w-full hover:translate-x-3 transition-all duration-400 hover:shadow-inner hover:shadow-stone-300"
    >
      <span className="text-lg text-[#566218] cursor-pointer">{item.icon}</span>
      {item.path ? (
        <Link
          to={item.path}
          className="block text-md text-slate-700 font-medium font-robotos"
        >
          {item.text}
        </Link>
      ) : (
        <button
          onClick={item.action}
          className="block text-md text-slate-700 font-medium font-robotos"
          type="button" 
        >
          {item.text}
        </button>
      )}
    </li>
  ))}
</ul>
</nav>
)
}
export default DashboardMenu;











