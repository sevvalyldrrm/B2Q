import React from 'react';

const Settings = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-400 mb-4">SETTINGS</div>
        <div className="text-xl text-gray-400 mb-8">Coming Soon</div>
        <div className="max-w-md mx-auto p-8 bg-gray-800/60 rounded-lg border border-gray-700">
          <p className="text-gray-300 leading-relaxed">
            System configuration and preferences panel is under development. 
            This section will include quantum parameters, AI settings, 
            and security configurations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
