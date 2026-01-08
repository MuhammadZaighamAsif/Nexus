import React, { useState } from 'react';
import { PlusCircle, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { WalletBalance } from '../../components/payments/WalletBalance';
import { TransactionHistory } from '../../components/payments/TransactionHistory';
import { PaymentForm, PaymentData } from '../../components/payments/PaymentForm';
import { FundingDealCard } from '../../components/payments/FundingDealCard';
import { useAuth } from '../../context/AuthContext';
import {
  getTransactionsForUser,
  getWalletForUser,
  getFundingDealsForUser,
  transactions,
  fundingDeals
} from '../../data/payments';
import { Transaction, FundingDeal } from '../../types';
import toast from 'react-hot-toast';

export const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'transfer' | 'funding'>('overview');
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([]);
  const [userFundingDeals, setUserFundingDeals] = useState<FundingDeal[]>([]);

  React.useEffect(() => {
    if (user) {
      setUserTransactions(getTransactionsForUser(user.id));
      setUserFundingDeals(getFundingDealsForUser(user.id));
    }
  }, [user]);

  const wallet = user ? getWalletForUser(user.id) : null;

  const handlePaymentSubmit = (data: PaymentData) => {
    // Simulate payment processing
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      type: activeTab as Transaction['type'],
      amount: data.amount,
      description: data.description,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      ...(activeTab === 'transfer' && { receiverId: data.recipientId }),
      ...(activeTab === 'deposit' && { receiverId: user?.id }),
      ...(activeTab === 'withdraw' && { senderId: user?.id })
    };

    // Add to transactions
    transactions.push(newTransaction);
    setUserTransactions(getTransactionsForUser(user!.id));

    // Update wallet balance
    if (wallet) {
      if (activeTab === 'deposit') {
        wallet.balance += data.amount;
      } else if (activeTab === 'withdraw') {
        wallet.balance -= data.amount;
      }
      wallet.lastUpdated = new Date().toISOString();
    }

    toast.success(`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} successful!`);
    setActiveTab('overview');
  };

  const handleFundDeal = (dealId: string) => {
    const deal = fundingDeals.find(d => d.id === dealId);
    if (!deal || !user || !wallet) return;

    // Update deal status
    deal.status = 'funded';
    deal.fundedAt = new Date().toISOString();

    // Create transaction
    const transaction: Transaction = {
      id: `t${Date.now()}`,
      type: 'funding',
      amount: deal.amount,
      senderId: user.id,
      receiverId: deal.entrepreneurId,
      description: deal.description,
      status: 'completed',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString()
    };

    transactions.push(transaction);
    setUserTransactions(getTransactionsForUser(user.id));
    setUserFundingDeals(getFundingDealsForUser(user.id));

    // Update wallet balance
    wallet.balance -= deal.amount;
    wallet.lastUpdated = new Date().toISOString();

    toast.success('Funding deal completed successfully!');
  };

  const handleCancelDeal = (dealId: string) => {
    const deal = fundingDeals.find(d => d.id === dealId);
    if (!deal) return;

    deal.status = 'cancelled';
    setUserFundingDeals(getFundingDealsForUser(user!.id));

    toast.success('Funding deal cancelled.');
  };

  if (!user || !wallet) return null;

  const tabs: Array<{ id: 'overview' | 'deposit' | 'withdraw' | 'transfer' | 'funding'; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = [
    { id: 'overview', label: 'Overview', icon: DollarSign },
    { id: 'deposit', label: 'Deposit', icon: ArrowDownLeft },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpRight },
    { id: 'transfer', label: 'Transfer', icon: ArrowRightLeft },
    { id: 'funding', label: 'Funding Deals', icon: PlusCircle }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage your funds and transactions</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Wallet Balance */}
          <WalletBalance balance={wallet.balance} currency={wallet.currency} />

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => setActiveTab('deposit')}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 h-12"
                  leftIcon={<ArrowDownLeft size={18} />}
                >
                  <span>Deposit Funds</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('withdraw')}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 h-12"
                  leftIcon={<ArrowUpRight size={18} />}
                  disabled={wallet.balance <= 0}
                >
                  <span>Withdraw Funds</span>
                </Button>
                <Button
                  onClick={() => setActiveTab('transfer')}
                  variant="outline"
                  className="flex items-center justify-center space-x-2 h-12"
                  leftIcon={<ArrowRightLeft size={18} />}
                  disabled={wallet.balance <= 0}
                >
                  <span>Transfer Funds</span>
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Transaction History */}
          <TransactionHistory transactions={userTransactions} currentUserId={user.id} />
        </div>
      )}

      {(activeTab === 'deposit' || activeTab === 'withdraw' || activeTab === 'transfer') && (
        <div className="max-w-2xl mx-auto">
          <PaymentForm
            onSubmit={handlePaymentSubmit}
            type={activeTab as 'deposit' | 'withdraw' | 'transfer'}
            maxAmount={activeTab === 'withdraw' || activeTab === 'transfer' ? wallet.balance : undefined}
          />
        </div>
      )}

      {activeTab === 'funding' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Funding Deals</h2>
              <p className="text-sm text-gray-600">
                {user.role === 'investor'
                  ? 'Manage your investment deals with entrepreneurs'
                  : 'Track funding deals from investors'
                }
              </p>
            </CardHeader>
            <CardBody>
              {userFundingDeals.length > 0 ? (
                <div className="space-y-4">
                  {userFundingDeals.map(deal => (
                    <FundingDealCard
                      key={deal.id}
                      deal={deal}
                      currentUserId={user.id}
                      onFund={user.role === 'investor' ? handleFundDeal : undefined}
                      onCancel={user.role === 'investor' ? handleCancelDeal : undefined}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <DollarSign size={24} className="text-gray-500" />
                  </div>
                  <p className="text-gray-600">No funding deals yet</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {user.role === 'investor'
                      ? 'Create funding deals with entrepreneurs'
                      : 'Funding deals from investors will appear here'
                    }
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};