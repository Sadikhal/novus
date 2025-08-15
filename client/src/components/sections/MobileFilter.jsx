import { Sheet, SheetContent, SheetTrigger } from '../ui/Sheet'
import { GiHamburgerMenu } from "react-icons/gi";
import FilterProduct from './FilterProduct';
const MobileFilter = ({  filters, 
  handleCheckboxChange, 
  categories, 
  handleClearAll,
  brands,
  handlePriceRangeChange, 
  handleColorChange
}) => {
  return (
    <div>
      <Sheet className="h-full p-12 w-40">
        <SheetTrigger>
          <div size={40} className="text-textBlue text-[24px] px-2">
          <GiHamburgerMenu  />
          </div>
        </SheetTrigger>
        <SheetContent className="bg-[#fff] overflow-x-hidden overflow-y-scroll "  side="leftFilter">
         <FilterProduct 
          filters={filters} 
          handleCheckboxChange={handleCheckboxChange}  
          handleColorChange={handleColorChange}
          categories={categories} 
          brands={brands} 
          handleClearAll={handleClearAll}
          handlePriceRangeChange={handlePriceRangeChange}/>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileFilter;
