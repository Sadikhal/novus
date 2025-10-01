import { Link } from "react-router-dom";
import useSellerData from "../hooks/useSellerData";
import FormModal from "../components/FormModal";
import Table from "../components/Table";
import TableSearch from "../components/TableSearch";
import BrandsPerformance from "../components/stats/brandsPerfomanceChart";
import BrandRevenuePerfomanceChart from "../components/stats/BrandRevenuePerfomance";
import { GrView } from "react-icons/gr";
import { Loader, ErrorFallback } from "../components/ui/Loaders";
import { useSelector } from "react-redux";

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "pl-4",

  },
  {
    header: "Brand Id",
    accessor: "brandId",
    className: "px-2",
  },
  {
    header: "SellerId",
    accessor: "sellerId",
    className: "px-2",
  },
    {
    header: "Seller",
    accessor: "seller",
    className: "px-2",
  },
  {
    header: "Email",
    accessor: "email",
    className: "px-2",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "px-2",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "px-2",
  },
];

const BrandListPage = () => {
  const {
    brands,
    filteredBrands,
    error,
    loading,
    handleSearchBrands,
    handleSort,
    deleteBrand
  } = useSellerData();
 const { currentUser } = useSelector((state) => state.user);
 

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <img
          src={item?.image?.[0] || "/images/avatar.png"}
          alt={item?.name || "Brand Logo"}
          onError={(e) => (e.currentTarget.src = "/images/avatar.png")}
          className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col max-w-48 overflow-x-hidden pr-2">
          <h3 className="font-semibold capitalize">{item.name}</h3>
          <p className="text-xs  text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="px-2">{item._id}</td>
      <td className="px-2">{item?.sellerId || "N/A"}</td>
      <td className="px-2 ml-2 text-nowrap capitalize">{item?.sellerName || "N/A"}</td>
      <td className="px-2">{item?.email || "N/A"}</td>
      <td className="px-2">{item?.number || "N/A"}</td>
      <td>
        <div className="flex items-center gap-2 px-2">
          <Link to={`/admin/brand/${item._id}`}>
            <button 
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#508bcd] cursor-pointer"
              aria-label={`View brand ${item.name}`}
            >
              <GrView className="text-lamaWhite"/>
            </button>
          </Link>
          {currentUser.isAdmin && (
            <FormModal 
              table="brand" 
              type="delete" 
              handleDelete={() => deleteBrand(item._id)} 
              id={item._id}
            />
          )}
        </div>
      </td>
    </tr>
  );

  if (loading && filteredBrands.length === 0) return <Loader />;
  if (error) return <ErrorFallback error={error} />;

  return (
    <div className="bg-white p-4 rounded-md flex-1 h-full m-4 mt-0 flex flex-col">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Brands</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearchBrands} />
          <div className="flex items-center gap-4 self-end">
            <button 
              onClick={handleSort}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow shadow-lg border-slate-100 border cursor-pointer hover:bg-lightBlue"
              aria-label="Sort brands"
            > 
              <img 
                src="/images/sort.png" 
                alt="Sort" 
                className="w-4 h-4" 
              />
            </button>
          </div>
        </div>
      </div>
       
      <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={filteredBrands} 
        loading={loading}
        error={error} 
      />
          
      <div className="w-full h-full pt-5">
        <BrandsPerformance />
      </div>
      <div className="w-full h-full pt-5">
        <BrandRevenuePerfomanceChart />
      </div>
    </div>
  );
};

export default BrandListPage;
