// hooks/useAnnouncementData.js
import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import { filteredItems } from "../lib/utils";
import { toast } from "../redux/useToast";

export default function useAnnouncementData() {
  const [announcementData, setAnnouncementData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get("/announcement", { 
          params: { sort: sortOrder } 
        });
        setAnnouncementData(res.data.announcements || []);
        setFilteredData(res.data.announcements || []);
      } catch (err) {
        setError(err.message || "Error fetching announcements");
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, [sortOrder]);

  const handleSearch = (term) => {
    const filtered = filteredItems(announcementData, term);
    setFilteredData(filtered);
  };

  const handleSort = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };

  const createAnnouncement = async (formData) => {
    try {
      setLoading(true);
      const res = await apiRequest.post("/announcement", formData);
      
      if (res.data?.announcement) {
        setAnnouncementData(prev => [res.data.announcement, ...prev]);
        setFilteredData(prev => [res.data.announcement, ...prev]);
      }
      
      toast({
        variant: "success",
        title: "Announcement created",
        description: "New announcement added successfully"
      });
      return res.data?.announcement;
    } catch (err) {
      setError(err.message || "Failed to create announcement");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAnnouncement = async (id, updatedData) => {
    try {
      setLoading(true);
      const res = await apiRequest.put(`/announcement/${id}`, updatedData);
      
      if (res.data?.announcement) {
        setAnnouncementData(prev => 
          prev.map(item => item._id === id ? res.data.announcement : item)
        );
        setFilteredData(prev => 
          prev.map(item => item._id === id ? res.data.announcement : item)
        );
      }
      
      toast({
        variant: "success",
        title: "Announcement updated",
        description: "Changes saved successfully"
      });
      
      return res.data?.announcement;
    } catch (err) {
      setError(err.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiRequest.delete(`/announcement/${id}`);
      setAnnouncementData(prev => prev.filter(item => item._id !== id));
      setFilteredData(prev => prev.filter(item => item._id !== id));
      
      toast({
        variant: "success",
        title: "Announcement deleted",
        description: "Announcement removed successfully"
      });
      return true;
    } catch (err) {
      setError(err.message || "Delete failed");
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    announcementData,
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    createAnnouncement,
    updateAnnouncement,
    handleDelete,
    sortOrder
  };
}