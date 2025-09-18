import { Link } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { PiChatCenteredDotsBold } from 'react-icons/pi';
import { FaRegHeart } from 'react-icons/fa6';
import { RiLockPasswordLine } from 'react-icons/ri';
import { ImProfile } from 'react-icons/im';
import { BiPurchaseTagAlt } from 'react-icons/bi';
import { FiShoppingCart } from 'react-icons/fi';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import { BiSupport } from 'react-icons/bi'; 
import { useAuth } from '../../hooks/useAuth';
import { useUserActions } from '../../hooks/useUserActions';

const DashboardMenu = () => {
  const { logoutUser } = useAuth();
  const { handleMessageSubmit } = useUserActions();

  const menuItems = [
    { icon: <RxDashboard />, text: 'Shopping', path: '/products' },
    { icon: <BiPurchaseTagAlt />, text: 'My Orders', path: '/dashboard/my-orders' },
    { icon: <FaRegHeart />, text: 'Wishlist', path: '/dashboard/my-wishlist' },
    { icon: <PiChatCenteredDotsBold />, text: 'Chat', path: '/dashboard/chat' },
    // { icon: <RiLockPasswordLine />, text: 'Change Password', path: '/forgot-password' },
    { icon: <ImProfile />, text: 'Profile', path: '/dashboard/profile' },
    { icon: <FiShoppingCart />, text: 'Cart', path: '/dashboard/cart' },
    {
      icon: <BiSupport />,
      text: 'Help Desk',
      path: null,
      action: () => handleMessageSubmit(import.meta.env.VITE_ADMIN_ID, 'help-desk'),
    },
    { icon: <RiLogoutBoxRLine />, text: 'Logout', path: null, action: logoutUser },
  ];

  return (
    <nav className="rounded-md z-50 h-min py-5 -left-4 lg:w-[230px] lg:ml-4 transition-all duration-300 bg-white w-full">
      <ul className="py-2 text-slate-600 sm:px-4 px-2 flex lg:flex-col lg:gap-2 gap-5 w-full justify-center lg:justify-start flex-wrap">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className="flex items-center gap-4 rounded-md w-32 sm:w-auto sm:min-w-48 hover:bg-white border-b-2 bg-[#fffefe] lg:min-w-full hover:translate-x-3 transition-all duration-400 hover:shadow-inner hover:shadow-stone-300"
          >
            {item.path ? (
              <Link
                to={item.path}
                className="md:text-md text-sm text-slate-700 font-medium font-robotos w-full px-2 py-2 flex flex-row flex-nowrap items-center md:gap-4 sm:gap-3 gap-2"
                aria-label={item.text}
              >
                <span className="md:text-lg text-base text-[#566218] cursor-pointer">{item.icon}</span>
                <div className="text-nowrap">{item.text}</div>
              </Link>
            ) : (
              <button
                onClick={item.action}
                className="text-slate-700 font-medium font-robotos px-2 py-2 flex flex-row flex-nowrap items-center gap-4 w-full cursor-pointer"
                type="button"
                aria-label={item.text}
              >
                <span className="text-lg text-[#566218] cursor-pointer">{item.icon}</span>
                <div>{item.text}</div>
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DashboardMenu;