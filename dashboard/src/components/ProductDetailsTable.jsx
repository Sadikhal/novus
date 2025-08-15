import Table from "./Table";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";



const columns = [
 
  {
    header: "",
    accessor: "",
  },


  {
    header: "",
    accessor: "",
  },
  

];

const ProductDetailsTable = ({product,brand}) => {
 const {currentUser} = useSelector((state) => state.user);
  const role = currentUser?.role;

  const details = [
    { label: 'Product Name', value: product?.name },
    { label: 'Product ID', value: product?._id },
    { label: 'Seller ID', value: product?.userId },
    { label: 'Brand', value: brand?.name },
    { label: 'Brand ID', value: brand?._id },
    { label: "Category", value: product.category },
    { label: "Actual Price", value: product.actualPrice,  },
    { label: "Selling Price", value: product.sellingPrice,},
    { label: "Discount Percentage", value: product?.discountPercentage ? `${product.discountPercentage}%` : 'N/A' },
    { label: "Size", value: product.size},
    { label: "Color", value: product.color},
    { label: "Rating", value: product.rating },
    { label: "Total Reviews", value: product.numReviews},
    { label: "Launch Date", value: format(parseISO(product.createdAt),'MM/dd/yyyy'), },
    { label: "Delivery Days", value: product.deliveryDays },
  
  ];
  const renderRow = () => (
    <table className="w-full">
      <tbody>
        {details.map((detail) => (
          <tr key={detail.label} className="border-b  border-gray-200 odd:bg-slate-50 text-sm hover:bg-lamaPurpleLight w-full">
            <td className="p-3 font-medium w-1/3">{detail.label}</td>
              <td className="p-3 w-2/3">{detail.value || 'N/A'}</td>
            <td className="p-3 ">
              <Link to={`/${role}/update-product/${product._id}`}
                      className="w-7 h-7 flex items-center justify-center rounded-full cursor-pointer bg-cyan-700"
                    >
                      <img 
                        src="/images/update.png" 
                        alt="update" 
                        className="bg-transparent w-4 h-4"
                      />
                    </Link> 
            </td>
          </tr>
        ))}
      </tbody>
    </table>
 
  );

  return (
    <div className="bg-[#fff] md:p-4 p-1 sm:p-3 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Product Details</h1>
        {/* <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto"> */}
          {/* <TableSearch /> */}

          {/* <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <img src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <img src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="productDetail" type="create" />}
          </div> */}

        {/* </div> */}
      </div>
      {/* LIST */}
      {/* <Table columns={columns} renderRow={renderRow} data={subjectsData} /> */}
      <Table columns={columns} renderRow={renderRow} data={[product]} />
      {/* PAGINATION */}
    </div>
  );
};

export default ProductDetailsTable;
