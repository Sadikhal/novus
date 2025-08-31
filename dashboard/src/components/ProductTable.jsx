import { useState } from "react";
import { format, parseISO } from "date-fns";
import { Link } from "react-router-dom";
import { GrView } from "react-icons/gr";
import FormModal from "./FormModal";
import Table from "./Table";
import TableSearch from "./TableSearch";
import { filteredItems } from "../lib/utils";
import { toast } from "../redux/useToast";
import { apiRequest } from "../lib/apiRequest";
import { useSelector } from "react-redux";

const columns = [
  {
    header: "Product Name",
    accessor: "name",
    className: "p-5 text-nowrap"
  },
  {
    header: "ProductId",
    accessor: "id",
  },
  {
    header: "Category",
    accessor: "category",
    className: "p-5",
  },
  {
    header: "Actual price",
    accessor: "actualPrice",
    className: "p-5 xl:p-0 text-nowrap",
  },
  {
    header: "Selling Price",
    accessor: "sellingPrice",
    className: "pl-4 md:pl-0 text-nowrap",
  },
  {
    header: "Product luanched",
    accessor: "date",
    className: "p-5 xl:p-0",
  },
  {
    header: "Size",
    accessor: "size",
    className: "p-5 xl:p-0",
  },
  {
    header: "Color",
    accessor: "color",
    className: "p-5 xl:p-0",
  },
  {
    header: "Ratings",
    accessor: "rating",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ProductTable = ({
  productsData,
  filteredData,
  setFilteredData,
  loading,
  error,
  setSortOrder
}) => {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = filteredItems(productsData, term);
    setFilteredData(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest.delete('/product/' + id);
      toast({
        title: "Product deleted successfully"
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "something went wrong"
      });
    }
  };

  const handleSort = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight "
    >
      <td className="text-nowrap w-full p-4">{item?.name}</td>
      <td>{item?._id}</td>
      <td className="px-4 flex gap-1 items-center pt-5 flex-row text-nowrap">
        {item.category?.map((data) => (
          <div key={data._id} className="px-1">{data}</div>
        ))}
      </td>
      <td className="p-5 xl:p-0">{item.actualPrice}</td>
      <td className="p-5 xl:p-0">{item.sellingPrice ? item.sellingPrice : actualPrice}</td>
      <td className="p-5 xl:p-0">{format(parseISO(item.createdAt), 'MM/dd/yyyy')}</td>
      <td className="p-5 xl:p-0">{item.size}</td>
      <td className="p-3 flex flex-row items-center justify-center h-full">
        {item?.color ? (
          Array.isArray(item.color) ?
            item.color.map((data, index) => (
              <div key={index} className="p-2">{data}</div>
            )) :
            <div className="px-1">{item.color}</div>
        ) : 'N/A'}
      </td>
      <td className="hidden md:table-cell">{item.rating}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link to={`/admin/product/${item._id}`}>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-full bg-[#508bcd] cursor-pointer"
              aria-label={`View brand ${item.name}`}
            >
              <GrView className="text-lamaWhite" />
            </button>
          </Link>
          {currentUser.isAdmin && (
            <>
              <FormModal table="productDetail" type="update" data={item} />
              <FormModal table="subject" type="delete" id={item._id} handleDelete={handleDelete} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 overflow-scroll">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Products</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearch} />
          <div className="flex items-center gap-4 self-end">
            <button onClick={handleSort} className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <img src="/images/sort.png" alt="" width={14} height={14} />
            </button>
            <FormModal table="productDetail" type="create" />
          </div>
        </div>
      </div>
      <Table columns={columns} renderRow={renderRow} data={filteredData} loading={loading} error={error} />
    </div>
  );
};

export default ProductTable;