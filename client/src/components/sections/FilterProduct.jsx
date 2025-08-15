import { Button } from '../ui/Button';

const FilterProduct = ({ 
  filters, 
  handleCheckboxChange, 
  categories, 
  handleClearAll,
  brands,
  handlePriceRangeChange, 
  handleColorChange
}) => {
  const priceRanges = [
    { label: '500 and below', min: undefined, max: 500 },
    { label: '500 to 1000', min: 500, max: 1000 },
    { label: '1000 to 3000', min: 1000, max: 3000 },
    { label: '3000 to 6000', min: 3000, max: 6000 },
    { label: '6000 to 10000', min: 6000, max: 10000 },
    { label: '10000 to 20000', min: 10000, max: 20000 },
    { label: '20000 to 30000', min: 20000, max: 30000 },
    { label: '30000 to 50000', min: 30000, max: 50000 },
    { label: '50000 and above', min: 50000, max: undefined },
  ];

  const colors = [
    { name: 'Red', hex: '#F53f5e' },
    { name: 'cyan', hex: '#3d82af' },
    { name: 'teal', hex: '#008080' },
    { name: 'yellow', hex: '#FFD700' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Black', hex: '#000000' },
    { name: 'Blue', hex: '#0068f1' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Brown', hex: '#964B00' },
    { name: 'rose', hex: '#f53292' },
    { name: 'green', hex: '#00bc8d' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Orange', hex: '#ff7b5c' },
    { name: 'Silver', hex: '#C0C0C0' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Bright green', hex: '#00ff3b' },
  ];

  return (
    <div className='w-full flex flex-col'>
      <div className='flex justify-between items-center py-1'>
        <div className='font-bold text-[17px] tracking-wider  font-assistant text-black uppercase hidden lg:flex px-1'>
          filters
        </div>
        <Button size="xs"
          className='font-bold text-[12px] h-8 w-20 tracking-wider px-1 bg-[#727e7a] font-assistant cursor-pointer text-slate-50 uppercase mr-2 rounded-3xl hover:bg-transparent hover:text-[#124f62] hover:border-[#124f62]-2 hover:border'
          onClick={handleClearAll}
        >
          Clear All
        </Button>
      </div>
      <div className='flex flex-col w-full border-r-gray-300 border-r border-t-gray-300 border-t'>
        {/* Categories Section */}
        <div className='flex flex-col w-full gap-5 font-robotos border-b-gray-300 border-b py-5'>
          <div className='text-[14px] font-bold text-black uppercase'>categories</div>
          <div className='flex flex-col gap-3'>
            {(categories || []).map((data) => (
              <div key={data._id} className='flex flex-row gap-4 items-center cursor-pointer'>
                <input
                  type="checkbox"
                  id={`cat-${data._id}`}
                  value={data.name}
                  checked={filters.category.includes(data.name)}
                  onChange={(e) => handleCheckboxChange(e, 'category')}
                  className="checkbox-sm checkbox bg-white border-[1px] border-slate-300 [--chkbg:theme(colors.slate.100)] [--chkfg:black] checked:text-[#2a5b63] checked:border-slate-100 rounded-sm"
                />
                <label
                  htmlFor={`cat-${data._id}`}
                  className='text-center text-[14px] text-black font-medium  capitalize tracking-w font-assistant'
                >
                  {data.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands Section */}
        <div className='flex flex-col w-full gap-5 font-robotos border-b-gray-300 border-b py-5'>
          <div className='text-[14px] font-bold text-black uppercase'>Brands</div>
          <div className='flex flex-col gap-3'>
            {(brands || []).map((data) => (
              <div key={data._id} className='flex flex-row gap-4 items-center cursor-pointer'>
                <input
                  type="checkbox"
                  id={`brand-${data._id}`}
                  value={data.name}
                  checked={filters.brand.includes(data.name)}
                  onChange={(e) => handleCheckboxChange(e, 'brand')}
                  className="checkbox-sm checkbox bg-white border-[1px] border-slate-300 [--chkbg:theme(colors.slate.100)] [--chkfg:black] checked:text-[#2a5b63] checked:border-slate-100 rounded-sm"
                />
                <label
                  htmlFor={`brand-${data._id}`}
                  className='text-center text-[14px] text-black font-medium  capitalize tracking-w font-assistant'
                >
                  {data.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Colors Section - Modified for toggle behavior */}
        <div className='flex flex-col w-full gap-5 font-robotos border-b-gray-300 border-b py-5'>
          <div className='text-[14px] font-bold text-black uppercase'>Colors</div>
          <div className='grid grid-cols-2 gap-3'>
            {colors.map((color) => (
              <div key={color.name} className="flex items-center gap-3 flex-row w-full">
                <input
                  type="checkbox"
                  id={`color-${color.name}`}
                  checked={filters.color === color.name}
                  onChange={() => handleColorChange(
                    filters.color === color.name ? null : color.name
                  )}
                  className="hidden"
                />
                <label
                  htmlFor={`color-${color.name}`}
                  className={`min-w-5 w-5 h-5 rounded-lg border-slate-300 marker:border-slate-400 border cursor-pointer flex items-center justify-center transition-all 
                    ${filters.color === color.name ? 'border-black scale-105' : 'border-gray-300'}`}
                  style={{ background: color.hex }}
                >
                  <span className={`text-xs font-semibold ${color.name === 'White' ? 'text-gray-700' : 'text-white'} 
                    ${filters.color === color.name ? 'opacity-100' : 'opacity-0'}`}>
                    ✓
                  </span>
                </label>
                <label
                  htmlFor={`color-${color.name}`}
                  className='text-center text-[14px] text-black font-medium  capitalize tracking-w font-assistant text-nowrap'
                >
                  {color.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range Section */}
        <div className='flex flex-col w-full gap-5 font-robotos border-b-gray-300 border-b py-5'>
          <div className='text-[14px] font-bold text-black uppercase'>Price Range</div>
          <div className='flex flex-col gap-3'>
            {priceRanges.map((range) => (
              <div key={range.label} className='flex flex-row gap-4 items-center cursor-pointer'>
                <input
                  type="checkbox"
                  id={range.label}
                  checked={filters.minPrice === range.min && filters.maxPrice === range.max}
                  onChange={() => handlePriceRangeChange(range.min, range.max)}
                  className="checkbox-sm checkbox bg-white border-[1px] border-slate-300 [--chkbg:theme(colors.slate.100)] [--chkfg:black] checked:text-[#2a5b63] checked:border-slate-100 rounded-sm"
                />
                <label
                  htmlFor={range.label}
                  className='text-center text-[14px] text-black font-medium  capitalize tracking-w font-assistant'
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterProduct;
