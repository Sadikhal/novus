import { useSelector, useDispatch } from "react-redux";
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/HoverCard';
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { logout } from "../../redux/userSlice";
import { useNavigate } from 'react-router-dom';
import { getMenuItems } from "../../lib/utils";
import { useAuth } from "../../hooks/useAuth";

const Account = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { logoutUser } = useAuth();
  
  
 const handleLogout = async () => {
  await logoutUser();
 }

  const menuItems = getMenuItems(currentUser, handleLogout);

  return (
    <div>
       <HoverCard className="z-100">
      <HoverCardTrigger className="md:w-[130px] xl:w-[180px] flex flex-row gap-2 items-center text-slate-800 cursor-pointer z-100">
        {currentUser ? (
          <>
            <div className="font-poppins text-base font-medium overflow-hidden text-nowrap">
              {currentUser?.name}
            </div>
            <div>
              <img 
                src={currentUser?.image || "/avatar.png"} 
                className="w-6 h-6 rounded-full object-cover"
                alt="User avatar"
              />
            </div>
            <IoIosArrowDown />
          </>
        ) : (
          <div className="font-poppins text-base font-medium">
            Account
          </div>
        )}
      </HoverCardTrigger>
      <HoverCardContent className="px-1 p-2 w-[180px] bg-[#fff]">
        {menuItems.map((item, index) => (
          <div key={index} className="bg-lamaWhite hover:bg-[#577569] px-4 rounded-md z-100">
            {item.path ? (
              <Link to={item.path} className="block py-1 text-sm text-slate-800 font-medium hover:text-lamaWhite font-poppins">
                {item.text}
              </Link>
            ) : (
              <button 
                onClick={item.action} 
                className="block w-full text-left py-1 text-sm text-slate-800 font-medium font-poppins hover:text-lamaWhite" 
                type="button"
              >
                {item.text}
              </button>
            )}
          </div>
        ))}
      </HoverCardContent>
    </HoverCard>
    </div>
  );
};

export default Account;