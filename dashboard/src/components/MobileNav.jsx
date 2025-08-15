import Menu from './layout/Menu';
import { Sheet, SheetContent, SheetTrigger } from './ui/Sheet'
import { GiHamburgerMenu } from "react-icons/gi";

const Mobilenav = ({ open, setOpen }) => {
  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <div className="text-lamateal text-[24px] px-2">
            <GiHamburgerMenu />
          </div>
        </SheetTrigger>
        <SheetContent className="bg-[#fff]" side="left">
          <Menu open={true} setOpen={setOpen} />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Mobilenav;