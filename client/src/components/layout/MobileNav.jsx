import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
import { Sheet, SheetTrigger, SheetContent } from '../../components/ui/Sheet';
import { getMenuItems } from "../../lib/utils";
import { useSelector } from "react-redux";
import { useAuth } from "../../hooks/useAuth";

const Mobilenav = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { logoutUser } = useAuth();
  const menuItems = getMenuItems(currentUser, logoutUser);

  return (
    <div>
      <Sheet className="w-full bg-lamaWhite">
        <SheetTrigger className="cursor-pointer">
          <GiHamburgerMenu size={24} className="text-[#266a6e] text-[28px]" />
        </SheetTrigger>
        <SheetContent className="flex bg-lamaWhite flex-col items-start gap-4" side="left">
          <div className="flex flex-col">
            <Link to="/" className="w-full">
              <img
                src="/novus9.png"
                className="w-28 h-28 rounded-full bg-transparent object-contain"
                alt="logo"
              />
            </Link>
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="shadow-sm mt-1"
              >
                {item?.path ? (
                  <Link
                    to={item.path}
                    className="block py-2 text-sm text-slate-800 font-medium hover:text-lamaWhite font-poppins text-nowrap bg-lamaWhite hover:bg-[#577569] px-4 rounded-md "
                  >
                    {item.text}
                  </Link>
                ) : (
                  <button
                    onClick={item.action}
                    className="block py-2 text-left w-full text-sm text-slate-800 font-medium font-poppins hover:text-lamaWhite  cursor-pointer bg-lamaWhite hover:bg-[#577569] px-4 rounded-md "
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