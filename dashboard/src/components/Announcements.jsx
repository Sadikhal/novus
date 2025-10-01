import { Loader } from "./ui/Loaders";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useAnnouncementData from "../hooks/useAnnouncementData";

const Announcements = () => {
  const {announcementData: announcements , loading, error } = useAnnouncementData();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const role = currentUser?.role;

  const bgColors = ['bg-[#f2f4e9]','bg-[#d4e8e9]','bg-lamaSkyLight','bg-[#d7e7d8]' ];

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Announcements</h1>
        <span 
          className="text-xs text-lamaPurple hover:underline cursor-pointer"
          onClick={() => navigate(`/${role}/announcements`)}
        >
          View All
        </span>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <div className="flex flex-col gap-4 mt-4">
          {announcements.slice(0,4).map((announcement, index) => (
            <div 
              key={announcement._id} 
              className={`${bgColors[index % bgColors.length]} rounded-md p-4`}
            >
              <div className="flex items-center justify-between">
                <h2 className="font-medium">{announcement.title}</h2>
                <span className="text-xs text-gray-600 bg-white rounded-md px-1 py-1">
                  {new Date(announcement.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">
                {announcement.desc}
              </p>
            </div>
          ))}
          
          {announcements.length === 0 && (
            <div className="text-center text-gray-400 py-4">
              No announcements found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Announcements;