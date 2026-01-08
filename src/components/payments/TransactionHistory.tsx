import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Transaction } from '../../types';
import { findUserById } from '../../data/users';

interface TransactionHistoryProps {
  transactions: Transaction[];
  currentUserId: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transactions,
  currentUserId
}) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="text-green-600" size={20} />;
      case 'withdraw':
        return <ArrowUpRight className="text-red-600" size={20} />;
      case 'transfer':
      case 'funding':
        return <ArrowRightLeft className="text-blue-600" size={20} />;
      default:
        return <DollarSign className="text-gray-600" size={20} />;
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={16} />;
      case 'failed':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getTransactionDescription = (transaction: Transaction) => {
    const { type, senderId, receiverId, description } = transaction;

    if (type === 'deposit') {
      return `Deposit: ${description}`;
    } else if (type === 'withdraw') {
      return `Withdrawal: ${description}`;
    } else if (type === 'transfer' || type === 'funding') {
      const sender = senderId ? findUserById(senderId) : null;
      const receiver = receiverId ? findUserById(receiverId) : null;

      if (senderId === currentUserId) {
        return `Sent to ${receiver?.name || 'Unknown'}: ${description}`;
      } else {
        return `Received from ${sender?.name || 'Unknown'}: ${description}`;
      }
    }

    return description;
  };

  const getAmountColor = (transaction: Transaction) => {
    const { type, senderId } = transaction;

    if (type === 'deposit' || (type === 'transfer' && senderId !== currentUserId) || (type === 'funding' && senderId !== currentUserId)) {
      return 'text-green-600';
    } else if (type === 'withdraw' || (type === 'transfer' && senderId === currentUserId) || (type === 'funding' && senderId === currentUserId)) {
      return 'text-red-600';
    }

    return 'text-gray-900';
  };

  const getAmountPrefix = (transaction: Transaction) => {
    const { type, senderId } = transaction;

    if (type === 'deposit' || (type === 'transfer' && senderId !== currentUserId) || (type === 'funding' && senderId !== currentUserId)) {
      return '+';
    } else if (type === 'withdraw' || (type === 'transfer' && senderId === currentUserId) || (type === 'funding' && senderId === currentUserId)) {
      return '-';
    }

    return '';
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-medium text-gray-900">Transaction History</h2>
      </CardHeader>
      <CardBody>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {getTransactionDescription(transaction)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()} at{' '}
                      {new Date(transaction.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className={`font-semibold ${getAmountColor(transaction)}`}>
                    {getAmountPrefix(transaction)}${transaction.amount.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-end space-x-2">
                    <Badge variant={getStatusBadgeVariant(transaction.status)} size="sm">
                      {transaction.status}
                    </Badge>
                    {getStatusIcon(transaction.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <DollarSign size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-600">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Your transaction history will appear here</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};