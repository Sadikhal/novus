import { format, parseISO } from 'date-fns';
import FormModal from '../components/FormModal';
import Table from '../components/Table';
import TableSearch from '../components/TableSearch';

const columns = [
  {
    header: "Product Name",
    accessor: "name",
    className: "p-5"
  },
  {
    header: "Product ID",
    accessor: "product",
    className: "p-5"
  },
  {
    header: "Order ID",
    accessor: "_id",
    className: "p-5"
  },
  {
    header: "Brand ID",
    accessor: "brand",
    className: "p-5"
  },
  {
    header: "Price",
    accessor: "price",
    className: "p-5 md:p-0"
  },
  {
    header: "Quantity",
    accessor: "quantity",
    className: "p-5"
  },
  {
    header: "Total Price",
    accessor: "total",
    className: "p-3"
  },
  {
    header: "Order Placed",
    accessor: "createdAt",
    className: "p-3"
  },
  {
    header: "Payment Status",
    accessor: "isCompleted",
    className: "p-5"
  },
  {
    header: "Customer Name",
    accessor: "customerName",
    className: "p-5"
  },
  {
    header: "Customer Id",
    accessor: "customerId",
    className: "p-5"
  },
  {
    header: "Status",
    accessor: "status",
    className: "p-5"
  },
  {
    header: "Contact Number",
    accessor: "number",
    className: "p-5"
  },
  {
    header: "Address",
    accessor: "address",
    className: "p-5"
  },
  {
    header: "Actions",
    accessor: "action",
    className: "p-5"
  },
];

const OrderTable = ({
  filteredData,
  error,
  loading,
  handleSearch,
  handleSort,
  handleDelete,
  updateOrder,
  sortOrder,
  role
}) => {
  const renderRow = (item) => {

    return (
      <tr
        key={item._id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight capitalize"
      >
        <td className="p-5 min-w-68">{item.name}</td>
        <td className="p-5">{item.product}</td>
        <td className="p-5">{item._id}</td>
        <td className="p-5">{item.brandId}</td>
        <td className="p-2">₹{item.price}</td>
        <td className="p-5">{item.quantity}</td>
        <td className="p-3">₹{item.total}</td>
        <td className="p-3">{format(parseISO(item.createdAt), 'MM/dd/yyyy')}</td>
        <td className="p-5">{item.isCompleted ? 'Completed' : 'Pending'}</td>
        <td className="p-5">{item.customerName}</td>
        <td className="p-5">{item.customerId}</td>
        <td className="p-5">{item.status}</td>
        <td className="p-5">{item.number}</td>
        <td className="min-w-68 p-5 flex-wrap">{item?.address}</td>
        <td>
          <div className="flex items-center justify-center gap-2">
            <FormModal 
              onSuccess={(data) => updateOrder(item?._id, data)}
              table="orderForm" 
              type="update" 
              data={item} 
            />
            {role === "admin" && (
              <FormModal 
                table="orderForm" 
                handleDelete={() => handleDelete(item._id)} 
                type="delete" 
                id={item._id} 
              />
            )}  
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 ">
      <div className="flex items-center justify-between flex-col md:flex-row gap-2">
        <h1 className="text-left w-full text-lg font-semibold">All Orders</h1>
        <div className="flex flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch 
            onSearch={handleSearch} 
            placeholder="Search orders..." 
          />
          <div className="flex items-center gap-4 self-end">
            <button 
              onClick={handleSort}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow shadow-lg border-slate-100 border cursor-pointer hover:bg-lightBlue"
              aria-label={`Sort ${sortOrder === "newest" ? "oldest first" : "newest first"}`}
            >
              <img 
                src="/images/sort.png" 
                alt="Sort" 
                width={14} 
                height={14} 
              />
            </button>
          </div>
        </div>
      </div>
      <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={filteredData} 
        loading={loading}
        error={error} 
      />
    </div>
  );
};

export default OrderTable;