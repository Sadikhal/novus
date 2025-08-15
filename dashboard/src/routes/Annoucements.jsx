import FormModal from "../components/FormModal";
import Table from "../components/Table";
import TableSearch from "../components/TableSearch";
import { useSelector } from "react-redux";
import useAnnouncementData from "../hooks/useAnnouncementData";

const Announcements = () => {
  const { currentUser } = useSelector((state) => state.user);
  const isAdmin = currentUser?.isAdmin;
  
  const {
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    createAnnouncement,
    updateAnnouncement,
    handleDelete,
    sortOrder
  } = useAnnouncementData();

  const columns = [
    { header: "Title", accessor: "title", className: "px-4 min-w-40" },
    { header: "Description", accessor: "desc", className: "px-4" },
    { header: "Date", accessor: "date", className: "px-4 min-w-32" },
    ...(isAdmin ? [{
      header: "Actions",
      accessor: "action",
      className: "px-4"
    }] : [])
  ];

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="px-4 py-4 capitalize font-medium">{item.title}</td>
      <td className="px-4 py-4 text-gray-600">{item.desc}</td>
      <td className="px-4 py-4">
        {new Date(item.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}
      </td>
      <td className="px-4 py-4 flex gap-2">
        {isAdmin && (
          <>
            <FormModal 
              table="announcementForm" 
              type="update" 
              data={item}
              onSuccess={(data) => updateAnnouncement(item._id, data)}
            />
            <FormModal 
              table="announcement"  
              type="delete" 
              id={item._id}
              handleDelete={() => handleDelete(item._id)}
            />
          </>
        )}
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 overflow-auto">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-xl font-semibold">All Announcements</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch 
            onSearch={handleSearch} 
            placeholder="Search announcements..." 
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
              <FormModal 
                table="announcementForm" 
                type="create" 
                onSuccess={createAnnouncement} 
              />
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

export default Announcements;