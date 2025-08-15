import { PiStorefrontBold } from "react-icons/pi";
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoSearchOutline } from "react-icons/io5";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../../redux/searchSlice';
import NotificationDropdown from '../sections/NotificationDropdown';
import Account from "../sections/Account";
import Mobilenav from "./MobileNav";
import { useCheckout } from "../../hooks/useCheckout";

const Navbar = () => {
  const [localSearch, setLocalSearch] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchTerm } = useSelector((state) => state.search);
  const { orderProducts } = useCheckout();

  useEffect(() => {
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(setSearchTerm(localSearch));
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [localSearch, dispatch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/products?search=${encodeURIComponent(localSearch)}`);
    }
  };

  return (
    <div className='w-full py-4 items-center h-[100px] xl:pl-8 lg:pl-6 px-1 md:pl-4 bg-[#ffff] border-b shadow-sm shadow-gray-200'>
      <div className='flex flex-row items-center w-full justify-between'>
        <div className='flex-row flex items-center gap-5'> 
          <Link to="/" className='md:w-[150px] md:h-[50px] sm:w-[125px] sm:h-[38px] xs:w-[80px] xs:h-[25px] w-[70px] h-[20px] items-center justify-center flex'>
            <img src='/novus9.png' className='w-24 h-24 sm:w-24 sm:h-24 rounded-full bg-transparent object-contain' alt='logo'/>
          </Link>
        </div>
      
        <div className='flex flex-row gap-5 items-center py-4 xs:min-w-[260px] w-[70%] min-w-[240px] sm:min-w-80 md:w-[40%]'>
          <form onSubmit={handleSearchSubmit} className='flex w-full max-w-xl border h-[32px] rounded-sm bg-[#feffff] sm:h-[38px] hover:bg-white focus:bg-white active:bg-white font-poppins'>
            <button type='submit' className='px-3 bg-inherit h-full rounded-sm text-[14px] leading-[24px]'>
              <IoSearchOutline className='bg-inherit h-full w-full py-1 text-gray-300'/>
            </button>
            <input
              type="text"
              placeholder="Search products"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className='bg-inherit text-black capitalize h-full p-2 w-full rounded-sm text-[14px] leading-[24px] outline-none'
            />
          </form>
        </div>

        <Link to={import.meta.env.VITE_DASHBOARD_URL} className='flex-row gap-2 text-base items-center h-full flex-[0.6] bg-[#ffffff] py-2 shadow-sm cursor-pointer px-2 rounded-md text-nowrap hidden lg:flex ml-3 xl:ml-0'>
          <PiStorefrontBold className="text-2xl font-normal text-[#2a5d61]" />
          <div className='font-helvetica font-medium text-slate-800 text-nowrap'>Become seller</div>
        </Link>

        <div className='md:flex gap-5 pl-3 hidden items-center py-4 pt-6 font-[700]'>
          <NotificationDropdown/>
        </div>

        <div className='md:flex xl:ml-10 ml-5 items-center py-4 pt-6 font-[700] mx-2 hidden w-min'>
          <Account/>
        </div>

        <div className='sm:flex items-center font-[700] mr-4 hidden'>
          <Link to="/dashboard/cart" className="relative cursor-pointer">
            <MdOutlineShoppingCart className="h-7 w-7 text-slate-800"/>
            <div className="absolute -right-1 -top-1 bg-[#095b4e] text-[10px] h-4 w-4 text-lamaWhite rounded-full justify-center flex items-center font-medium">
              {orderProducts.length}
            </div>
          </Link>
        </div>

        <div className='block md:hidden'>
          <Mobilenav />
        </div>
      </div>
    </div>   
  );
};

export default Navbar;