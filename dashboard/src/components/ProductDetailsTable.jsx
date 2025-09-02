import Table from "./Table";
import { format, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const columns = [
  { header: "Label", accessor: "label" },
  { header: "Value", accessor: "value" },
  { header: "Actions", accessor: "actions" },
];

const ProductDetailsTable = ({ product, brand }) => {
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;

  const details = [
    { label: "Product Name", value: product?.name },
    { label: "Product ID", value: product?._id },
    { label: "Seller ID", value: product?.userId },
    { label: "Brand", value: brand?.name },
    { label: "Brand ID", value: brand?._id },
    { label: "Category", value: product?.category?.join(", ") },
    { label: "Actual Price", value: product?.actualPrice },
    { label: "Selling Price", value: product?.sellingPrice },
    {
      label: "Discount Percentage",
      value: product?.discount
        ? `${product.discount}%`
        : "N/A",
    },
    { label: "Size", value: product?.size?.join(", ") },
    { label: "Color", value: product?.color?.join(", ") },
    { label: "Rating", value: product?.rating },
    { label: "Total Reviews", value: product?.numReviews },
    {
      label: "Launch Date",
      value: product?.createdAt
        ? format(parseISO(product.createdAt), "MM/dd/yyyy")
        : "N/A",
    },
    { label: "Delivery Days", value: product?.deliveryDays },
  ];

  const renderRow = () =>
    details.map((detail, i) => (
      <tr
        key={i}
        className="border-b border-gray-200 odd:bg-slate-50 text-sm hover:bg-lamaPurpleLight w-full"
      >
        <td className="p-3 font-medium w-1/3">{detail.label}</td>
        <td className="p-3 w-2/3">{detail.value || "N/A"}</td>
        <td className="p-3">
          <Link
            to={`/${role}/update-product/${product._id}`}
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
    ));

  return (
    <div className="bg-[#fff] md:p-4 p-1 sm:p-3 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Product Details
        </h1>
      </div>
      <Table columns={columns} renderRow={renderRow} data={[product]} />
    </div>
  );
};

export default ProductDetailsTable;
