import React from 'react';
import VideoChat from '../../components/videoChat/VideoChat';

export const VideoCallPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
          <p className="text-gray-600">Connect with investors and entrepreneurs</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <VideoChat />
      </div>
    </div>
  );
};