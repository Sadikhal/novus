import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";

export const useChartData = (endpoint, params = {}, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await apiRequest.get(endpoint, { params });
        setData(response.data.data || response.data);
      } catch (err) {
        setError(`Failed to load ${endpoint.split('/').pop()} data`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error };
};