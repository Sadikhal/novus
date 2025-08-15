import { Sheet, SheetContent, SheetTrigger } from './ui/Sheet';
import { GiHamburgerMenu } from "react-icons/gi";
import { Button } from './ui/Button';
import { Link } from 'react-router-dom';

const MobileBrandNav = ({ currentUser, scrollToSection }) => {
  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <div className="text-lamateal text-[24px] px-2 cursor-pointer">
            <GiHamburgerMenu />
          </div>
        </SheetTrigger>
        <SheetContent className="bg-[#fff] w-[280px]" side="left">
          <div className="flex flex-col space-y-2 p-4">
            {currentUser ? (
              <Link to={`/${currentUser.role}/Dashboard`} className="w-full">
                <Button className="w-full border border-[#26858c] text-[#26858c] rounded-sm flex flex-row gap-2 hover:bg-[#26858c] hover:text-white">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register" className="w-full">
                  <Button className="w-full border border-[#26858c] text-[#ffff] rounded-sm flex flex-row gap-2 bg-[#26858c] hover:bg-lamaWhite hover:text-[#26858c]">
                    Register
                  </Button>
                </Link>
                <Link to="/login" className="w-full">
                  <Button className="w-full border border-[#26858c] text-[#26858c] rounded-sm flex flex-row gap-2 hover:bg-[#26858c] hover:text-white">
                    Login
                  </Button>
                </Link>
              </>
            )}

            <button 
              onClick={() => scrollToSection('sell-on-novus')} 
              className="text-[#181b1b] text-base capitalize font-poppins font-normal cursor-pointer text-left hover:bg-[#ede4e4] rounded-lg p-2"
            >
              Sell on Novus
            </button>

            <button 
              onClick={() => scrollToSection('service')} 
              className="text-[#181b1b] text-base capitalize font-poppins font-normal cursor-pointer text-left hover:bg-[#ede4e4] rounded-lg p-2"
            >
              Services
            </button>

            <button 
              onClick={() => scrollToSection('stories')} 
              className="text-[#181b1b] text-base capitalize font-poppins font-normal cursor-pointer text-left hover:bg-[#ede4e4] rounded-lg p-2"
            >
              Success Stories
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileBrandNav;