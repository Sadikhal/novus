import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import { filteredItems } from "../lib/utils";
import { toast } from "../redux/useToast";

export default function useEventData() {
  const [eventData, setEventData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get("/event", { 
          params: { sort: sortOrder } 
        });
        setEventData(res.data.events || []);
        setFilteredData(res.data.events || []);
      } catch (err) {
        setError(err.message || "Error fetching event data");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [sortOrder]);

  const handleSearch = (term) => {
    const filtered = filteredItems(eventData, term);
    setFilteredData(filtered);
  };

  const handleSort = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };





  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      const res = await apiRequest.post("/event", eventData);
      
      if (res.data?.event) {
        setEventData(prev => [res.data.event, ...prev]);
        setFilteredData(prev => [res.data.event, ...prev]);
      }

      toast({
        variant: "success",
        title: "Event created",
        description: "New event added successfully"
      });
      return res.data?.event;
    } catch (err) {
      setError(err.message || "Failed to create event");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id, updatedData) => {
    try {
      setLoading(true);
      const res = await apiRequest.put(`/event/${id}`, updatedData);
      
      if (res.data?.event) {
        setEventData(prev => 
          prev.map(event => event._id === id ? res.data.event : event)
        );
        setFilteredData(prev => 
          prev.map(event => event._id === id ? res.data.event : event)
        );
      }
      
      toast({
        variant: "success",
        title: "Event updated successfully",
        description: "Your changes have been saved"
      });
      
      return res.data?.event;
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
      await apiRequest.delete(`/event/${id}`);
      setEventData(prev => prev.filter(item => item._id !== id));
      setFilteredData(prev => prev.filter(item => item._id !== id));
      
      toast({
        variant: "success",
        title: "Event deleted successfully",
        description: "Event has been removed"
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
    eventData,
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    createEvent,
    updateEvent,
    handleDelete,
    sortOrder
  };
}