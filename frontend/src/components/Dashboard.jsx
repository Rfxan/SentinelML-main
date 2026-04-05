import React from 'react';
import TrafficFeed from './TrafficFeed';
import ThreatGauge from './ThreatGauge';
import ModelHealth from './ModelHealth';
import AttackTimeline from './AttackTimeline';
import BlockList from './BlockList';

const Dashboard = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto h-[calc(100vh-120px)]">
      <div className="flex flex-col gap-6 lg:col-span-1 h-full overflow-hidden">
        <TrafficFeed feed={data.trafficFeed} />
      </div>

      <div className="flex flex-col gap-6 lg:col-span-1">
        <div className="h-64">
          <ThreatGauge feed={data.trafficFeed} />
        </div>
        <div className="flex-1">
          <ModelHealth stats={data.modelStats} />
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:col-span-1 h-full overflow-hidden">
        <div className="h-64">
          <AttackTimeline feed={data.trafficFeed} />
        </div>
        <div className="flex-1 overflow-hidden">
          <BlockList ips={data.blockedIPs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
