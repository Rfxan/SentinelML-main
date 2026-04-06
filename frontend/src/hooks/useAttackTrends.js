import { useState, useEffect } from 'react';

const POLLING_INTERVAL = 2500;

export function useAttackTrends(windowSeconds = 15) {
  const [data, setData] = useState([]);

  useEffect(() => {
    let timeoutId;
    let isSubscribed = true;

    const fetchFeed = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL || '/api'}/traffic-feed`;
        const response = await fetch(url);
        const feed = await response.json();
        
        if (!isSubscribed) return;

        const now = new Date();
        const buckets = {};
        
        for (let i = windowSeconds - 1; i >= 0; i--) {
          const d = new Date(now.getTime() - i * 1000);
          const timeKey = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
          buckets[timeKey] = { time: timeKey, normal: 0, attacks: 0, adversarial: 0 };
        }

        const cutoff = new Date(now.getTime() - windowSeconds * 1000);

        feed.forEach(event => {
          const eventTime = new Date(event.timestamp.replace(' ', 'T'));
          if (eventTime >= cutoff) {
            const timeKey = `${String(eventTime.getHours()).padStart(2, '0')}:${String(eventTime.getMinutes()).padStart(2, '0')}:${String(eventTime.getSeconds()).padStart(2, '0')}`;
            if (buckets[timeKey]) {
              if (event.type === 'normal' || event.type === 'train') {
                buckets[timeKey].normal++;
              } else if (event.type === 'attack') {
                buckets[timeKey].attacks++;
              } else if (event.type === 'evasion' || event.type === 'poison') {
                buckets[timeKey].adversarial++;
              }
            }
          }
        });

        setData(Object.values(buckets));
      } catch (err) {
        console.error('Failed to fetch traffic feed for trends', err);
      }

      if (isSubscribed) {
        timeoutId = setTimeout(fetchFeed, POLLING_INTERVAL);
      }
    };

    fetchFeed();

    return () => {
      isSubscribed = false;
      clearTimeout(timeoutId);
    };
  }, []);

  return data;
}
