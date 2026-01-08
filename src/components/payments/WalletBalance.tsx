import React from 'react';
import { Wallet } from 'lucide-react';
import { Card, CardBody } from '../ui/Card';

interface WalletBalanceProps {
  balance: number;
  currency: string;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ balance, currency }) => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Wallet size={24} className="text-blue-700" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Wallet Balance</p>
              <h3 className="text-2xl font-bold text-blue-900">
                {currency} {balance.toLocaleString()}
              </h3>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600">Available</p>
            <p className="text-sm font-medium text-blue-800">Ready to use</p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};