import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from '../../components/ui/Sheet';
import { getMenuItems } from "../../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/userSlice";


const Mobilenav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = getMenuItems(currentUser, handleLogout);

  return (
    <div>
      <Sheet className="w-full bg-lamaWhite">
        <SheetTrigger className="cursor-pointer">
          <GiHamburgerMenu size={24} className="text-[#266a6e] text-[28px]" />
        </SheetTrigger>
        <SheetContent className="flex bg-lamaWhite flex-col items-start gap-4" side="left">
          <div className="flex flex-col">
            <Link to='/' className="w-full">
              <img 
                src='/novus9.png' 
                className='w-28 h-28 rounded-full bg-transparent object-contain' 
                alt='logo'
              />
            </Link>

            {menuItems.map((item, index) => (
              <div 
                key={index}
                className="bg-lamaWhite hover:bg-[#577569] px-4 rounded-md shadow-sm mt-1"
              >
                {item?.path ? (
                  <Link
                    to={item.path}
                    className="block py-2 text-sm text-slate-800 font-medium hover:text-lamaWhite font-poppins text-nowrap"
                  >
                    {item.text}
                  </Link>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="block py-2 text-sm text-slate-800 font-medium font-poppins hover:text-lamaWhite"
                    type="button"
                  >
                    {item.text}
                  </button>
                )}
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Mobilenav;