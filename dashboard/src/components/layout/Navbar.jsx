import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import NotificationDropdown from "../../components/NotificationDropdown";
import { menuItems } from "../../lib/menuItems";

const Navbar = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.length > 0) {
      const results = menuItems[0].items.filter(item => 
        item.visible.includes(currentUser?.role) && 
        item.label.toLowerCase().includes(query)
      );
      setFilteredItems(results);
      setShowResults(true);
    } else {
      setFilteredItems([]);
      setShowResults(false);
    }
  };

  const handleItemClick = (href) => {
    navigate(`/${currentUser?.role}/${href}`);
    setSearchQuery("");
    setShowResults(false);
  };

  return (
    <div className='flex items-center justify-between p-4 bg-[#fff] ml-2  rounded-lg mb-3 md:gap-4 lg:gap-16 md:px-6'>
      <Link to="/" className="h-full w-full">
        <img 
          src="/images/novus10.png" 
          className='w-20 h-20 rounded-full bg-transparent object-contain' 
          alt="logo"  
        />
      </Link>
      <div 
        ref={searchRef}
        className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1px] bg-[#ffffff] hover:ring-gray-400 ring-gray-200 px-2 relative'
      >
        <img src="/images/search.png" className="w-[14px] h-[14px]" alt="" />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-[250px] p-2 bg-transparent outline-none"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => searchQuery.length > 0 && setShowResults(true)}
        />
        {showResults && filteredItems.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                onClick={() => handleItemClick(item.href)}
              >
                <img src={item.icon} alt="" className="w-4 h-4" />
                <span className="text-sm">{item.label}</span>
              </div>
            ))}
          </div>
        )}
        {showResults && searchQuery.length > 0 && filteredItems.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 text-sm text-gray-500">
            No results found
          </div>
        )}
      </div>
      <div className='flex items-center gap-6 justify-end w-full lg:px-8'>
        <div className='md:flex gap-5 pl-3 hidden items-center py-4 pt-6 font-[700]'>
          <NotificationDropdown/>
        </div>
        <Link 
          to={`/${currentUser.role}/profile`}
          className="p-2 flex flex-row gap-3 items-center justify-between border border-slate-200 rounded-full hover:shadow-xl cursor-pointer"
        >
          <div className='flex flex-col'>
            <span className="text-xs  font-medium font-robotos">{currentUser.name}</span>
            <span className="text-[10px] text-gray-500 text-left">{currentUser.role}</span>
          </div>
          <img src={currentUser.image || "/images/avatar.png"} alt="user" className="rounded-full object-cover w-7 h-7"/>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;