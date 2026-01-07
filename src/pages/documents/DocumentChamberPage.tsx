import React from 'react';
import DocumentChamber from '../../components/docChamber/DocumentChamber';

export const DocumentChamberPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">Review and sign deals and contracts</p>
        </div>
      </div>
      <DocumentChamber />
    </div>
  );
};