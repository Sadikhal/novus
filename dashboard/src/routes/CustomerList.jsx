
import { Link } from "react-router-dom";
import FormModal from "../components/FormModal";
import Table from "../components/Table";
import TableSearch from "../components/TableSearch";
import { format, parseISO } from "date-fns";
import useCustomerData from "../hooks/useCustomerData";
import { GrView } from "react-icons/gr";
import { useSelector } from "react-redux";

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "px-3",

  },
  {
    header: "Customer ID",
    accessor: "xustomerId",
    className: "px-3",
  },
  {
    header: "Total orders",
    accessor: "order",
    className: "px-3",
  },
  {
    header: "Number",
    accessor: "number",
    className: "px-3",
  },
  {
    header: "Role",
    accessor: "role",
    className: "px-3",
  },
  {
    header: "Last Login",
    accessor: "lastLogin",
    className: "px-3",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const CustomerList = () => {
  const {
    filteredCustomers,
    error,
    loading,
    handleSearchCustomers,
    handleSort,
    handleDeleteCustomer :handleDelete
  } = useCustomerData();
  const { currentUser } = useSelector((state) => state.user);
 


  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-1">
        <img
          src={item?.image || "/images/avatar.png"}
          alt={item?.name || "Customer Avatar"}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col max-w-48 overflow-x-hidden pr-2">
          <h3 className="font-semibold">{item.name}</h3>
          <p className="text-xs text-gray-500 pr-2">{item?.email}</p>
        </div>
      </td>
      <td className="px-3">{item._id}</td>
      <td className="px-3">{item?.orders || 'NA'}</td>
      <td className="px-3">{item?.number || 'NA'}</td>
      <td className="px-3">{item?.role}</td>
      <td className="px-3">
        {item?.lastLogin ? format(parseISO(item.lastLogin), 'MM/dd/yy') : 'NA'}
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link to={`/admin/customer/${item._id}`}>
            <button 
              className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky"
              aria-label={`View customer ${item.name}`}
            >
              <GrView className="text-lamaWhite"/>
            </button>
          </Link>
          {currentUser.isAdmin && (
            <FormModal 
              table="customer" 
              type="delete" 
              handleDelete={() => handleDelete(item._id)} 
              id={item._id}
            />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white md:p-4 sm:p-3 p-1 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Customers</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch onSearch={handleSearchCustomers} />
          <div className="flex items-center gap-4 self-end">
            <button 
              onClick={handleSort}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow shadow-lg border-slate-100 border cursor-pointer hover:bg-lightBlue"
              aria-label="Sort customers"
            >
              <img src="/images/sort.png" alt="Sort"className="w-4 h-4" 
 />
            </button>
          </div>
        </div>
      </div>
       <Table 
        columns={columns} 
        renderRow={renderRow} 
        data={filteredCustomers} 
        loading={loading}
        error={error} 
      />
    </div>
  );
};

export default CustomerList;
