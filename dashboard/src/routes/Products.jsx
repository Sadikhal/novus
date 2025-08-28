import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useProductData from "../hooks/useProductData";
import FormModal from "../components/FormModal";
import Table from "../components/Table";
import TableSearch from "../components/TableSearch";
import ProductsSoldChart from "../components/stats/TotalProductChart";
import ProductPerformanceChart from "../components/stats/ProductRevenueChart";
import ProductsSalesPerformanceChart from "../components/stats/ProductSalesPerformance";
import ProductRevenueTrends from "../components/stats/ProductsRevenueTrends";
import { GrView } from "react-icons/gr";
import BrandProductsSalesChart from "../components/stats/SingleBrandSalesChart";
import BrandProductRevenuePerformance from "../components/stats/SingleBrandRevenueChart";

const columns = [
  {
    header: "Product Name",
    accessor: "name",
    className: "px-3"
  },
  {
    header: "Brand",
    accessor: "brand",
  },
  {
    header: "Product Id",
    accessor: "productId",
    className: "pl-4",
  },
  {
    header: "Category",
    accessor: "category",
    className: "px-2",
  },
  {
    header: "Price",
    accessor: "price",
    className: "pl-4 md:pl-0",
  },
  {
    header: "Color",
    accessor: "color",
    className: "hidden px-3 md:flex",
  },
  {
    header: "Ratings",
    accessor: "rating",
    className: "hidden lg:table-cell px-2",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "px-2"
  },
];

const ProductsList = () => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;
  
  const {
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    handleDelete
  } = useProductData(role);

  const renderRow = (item) => (
    <tr
      key={item?._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight items-center"
    >
      <td className="flex items-center gap-4 p-4">{item?.name}</td>
      <td className="px-2">{item?.brand}</td>
      <td className="px-3">{item?._id}</td>
      <td className="px-2 flex gap-1 items-center  flex-row text-nowrap">
        {item.category?.map((data) => (
          <div key={data?._id} className="px-1">{data}</div>
        ))}
      </td>
      <td className="px-5 md:px-0">{item?.sellingPrice}</td>
      <td className="hidden px-2 md:flex flex-row">
        {item?.color ? (
          Array.isArray(item?.color) ? 
            item.color.map((data, index) => (
              <div key={index} className="px-1">{data}</div>
            )) : 
            <div className="px-1">{item?.color}</div>
        ) : 'N/A'}
      </td>
      <td className="hidden md:table-cell pl-5">
        {item?.rating?.toFixed(1) ?? 'N/A'}
      </td>
      <td className="flex items-stretch gap-1 pl-2">     
        <div className="flex items-center gap-2">
          <Link to={`/${role}/product/${item?._id}`}>
            <button 
              className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky cursor-pointer"
              aria-label={`View product ${item?.name}`}
            >
              <GrView className="text-lamaWhite" />
            </button>
          </Link>
         <Link to = {`/${role}/update-product/${item?._id}`}
            className= 'w-7 h-7 flex items-center justify-center rounded-full cursor-pointer bg-cyan-700'
          >
            <img 
              src='/images/update.png' 
              alt="create" 
              className="bg-transparent w-4 h-4"
            />
          </Link>
          <FormModal 
            table="productDetail"  
            handleDelete={() => handleDelete(item?._id)} 
            type="delete" 
            id={item?._id} 
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white sm:p-3 md:p-4 p-1 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Products</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch 
            onSearch={handleSearch} 
            placeholder="Search products..." 
          />
          <div className="flex items-center gap-4 self-end">
            <button 
              onClick={handleSort}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow shadow-lg border-slate-100 border cursor-pointer hover:bg-lightBlue"
              aria-label="Sort products"
            >
              <img 
                src="/images/sort.png" 
                alt="Sort" 
                width={14} 
                height={14} 
              />
            </button>
         
              <Link to = {`/${role}/add-product`}
            className= 'w-7 h-7 flex items-center justify-center rounded-full cursor-pointer bg-lamaYellow hover:bg-lightBlue shadow-lg border-slate-100 border'
          >
            <img 
              src='/images/create.png' 
              alt="create" 
              className="bg-transparent w-4 h-4"
            />
          </Link>
          
          </div>
        </div>
      </div>

     <div className="overflow-x-scroll w-full">
      <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={filteredData} 
        loading={loading}
        error={error} 
      />
    </div>   
    { currentUser.isAdmin ? (
          
      <div className="flex flex-col gap-6 mt-6">
        <div className="w-full h-[600px]">
          <ProductsSoldChart />
        </div>
        <div className="w-full h-[700px]">
          <ProductRevenueTrends />
        </div>
        <div className="w-full h-[700px]">
          <ProductPerformanceChart />
        </div>
        <div className="w-full h-[700px]">
          <ProductsSalesPerformanceChart />
        </div>
       
      </div>
       ) : currentUser.isSeller ? (
      <div className="flex flex-col gap-6 mt-6">
        <div className="w-full h-[700px]">
          <BrandProductRevenuePerformance brandId = {currentUser?.brand?._id}/>
          </div>
          <div className="w-full h-[700px]">
            <BrandProductsSalesChart brandId = {currentUser?.brand?._id}/>
          </div>
         </div> 
       ) : null }
    </div>
  );
};

export default ProductsList;