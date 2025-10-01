import { useSelector } from "react-redux";
import useEventData from "../hooks/useEventData";
import FormModal from "../components/FormModal";
import Table from "../components/Table";
import TableSearch from "../components/TableSearch";

const EventListPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  
  const {
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    createEvent,
    updateEvent,
    handleDelete,
    sortOrder
  } = useEventData();

  const columns = [
    {
      header: "Event Title",
      accessor: "title",
      className: "px-2"
    },
    {
      header: "Description",
      accessor: "desc",
      className: "table-cell"
    },
    {
      header: "Start Date",
      accessor: "startingDate",
      className: "px-2"
    },
    {
      header: "End Date",
      accessor: "endingDate",
      className: "table-cell"
    },
    {
      header: "Time",
      accessor: "time",
      className: "px-2"
    },
    {
      header: "Status",
      accessor: "status",
      className: "px-2"
    },
    ...(isAdmin ? [{
      header: "Actions",
      accessor: "action",
      className: "px-2"
    }] : [])
  ];

  const renderRow = (item) => {
    const currentDate = new Date();
    const startDate = new Date(item?.startingDate);
    const endDate = new Date(item?.endingDate);
    let status = "Upcoming";
    
    if (currentDate > endDate) {
      status = "Completed";
    } else if (currentDate >= startDate && currentDate <= endDate) {
      status = "Ongoing";
    }

    return (
      <tr
        key={item?._id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight items-center"
      >
        <td className="table-cell px-2 py-5 capitalize min-w-60">{item?.title}</td>
        <td className="table-cell px-2 min-w-80">{item?.desc}</td>
        <td className="px-2">
          {item?.startingDate ? new Date(item?.startingDate).toLocaleDateString() : 'N/A'}
        </td>
        <td className="table-cell px-2">
          {item?.endingDate ? new Date(item?.endingDate).toLocaleDateString() : 'N/A'}
        </td>
        <td className="px-2 text-nowrap">
          {item?.startingTime} - {item?.endingTime}
        </td>
        <td className="px-2">
          <span className={`px-2 py-1 rounded-full text-xs ${
            status === "Completed" ? "bg-gray-200 text-gray-800" :
            status === "Ongoing" ? "bg-green-100 text-green-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {status}
          </span>
        </td>
        
        {isAdmin && (
          <td className="text-nowrap flex flex-row items-center mx-4 gap-2 py-4">     
            <FormModal 
              onSuccess={(data) => updateEvent(item?._id, data)}
              table="eventForm" 
              type="update" 
              data={item} 
            />
            <FormModal 
              table="eventForm"  
              handleDelete={() => handleDelete(item?._id)} 
              type="delete" 
              id={item?._id} 
            />
          </td>
        )}
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 ">
      <div className="flex items-center justify-between">
        <h1 className="block text-lg font-semibold">All Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch 
            onSearch={handleSearch} 
            placeholder="Search events..." 
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
                className="w-4 h-4"
              />
            </button>
            {isAdmin && (
              <FormModal table="eventForm" type="create" onSuccess={createEvent} />
            )}
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

export default EventListPage;