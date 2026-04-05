import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const useTrafficPolling = () => {
  const [trafficFeed, setTrafficFeed] = useState([]);
  const [modelStats, setModelStats] = useState(null);
  const [blockedIPs, setBlockedIPs] = useState({});
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    let trafficInterval;
    let blockedInterval;

    const fetchFast = async () => {
      try {
        const [feedRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE}/traffic-feed`),
          axios.get(`${API_BASE}/model-stats`)
        ]);
        setTrafficFeed(feedRes.data);
        setModelStats(statsRes.data);
        setIsLive(true);
      } catch (err) {
        setIsLive(false);
      }
    };

    const fetchSlow = async () => {
      try {
        const res = await axios.get(`${API_BASE}/blocked-ips`);
        setBlockedIPs(res.data);
      } catch (err) { }
    };

    fetchFast();
    fetchSlow();

    trafficInterval = setInterval(fetchFast, 2000);
    blockedInterval = setInterval(fetchSlow, 3000);

    return () => {
      clearInterval(trafficInterval);
      clearInterval(blockedInterval);
    };
  }, []);

  return { trafficFeed, modelStats, blockedIPs, isLive };
};
