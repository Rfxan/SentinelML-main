import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const useTrafficPolling = () => {
  const [trafficFeed, setTrafficFeed] = useState([]);
  const [modelStats, setModelStats] = useState(null);
  const [blockedIPs, setBlockedIPs] = useState({});
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let pollInterval;

    const fetchAll = async () => {
      try {
        const [feedRes, statsRes, blockedRes] = await Promise.all([
          axios.get(`${API_BASE}/traffic-feed`),
          axios.get(`${API_BASE}/model-stats`),
          axios.get(`${API_BASE}/blocked-ips`)
        ]);
        
        setTrafficFeed(feedRes.data);
        setModelStats(statsRes.data);
        setBlockedIPs(blockedRes.data);
        setIsLive(true);
      } catch (err) {
        console.error("Failed to connect to backend:", err);
        setIsLive(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
    pollInterval = setInterval(fetchAll, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  return { trafficFeed, modelStats, blockedIPs, isLive, isLoading };
};
