import React from 'react';
import { DollarSign, User, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { FundingDeal } from '../../types';
import { findUserById } from '../../data/users';

interface FundingDealCardProps {
  deal: FundingDeal;
  currentUserId: string;
  onFund?: (dealId: string) => void;
  onCancel?: (dealId: string) => void;
}

export const FundingDealCard: React.FC<FundingDealCardProps> = ({
  deal,
  currentUserId,
  onFund,
  onCancel
}) => {
  const investor = findUserById(deal.investorId);
  const entrepreneur = findUserById(deal.entrepreneurId);

  const isInvestor = currentUserId === deal.investorId;
  const isEntrepreneur = currentUserId === deal.entrepreneurId;

  const getStatusIcon = (status: FundingDeal['status']) => {
    switch (status) {
      case 'funded':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return null;
    }
  };

  const getStatusBadgeVariant = (status: FundingDeal['status']) => {
    switch (status) {
      case 'funded':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                ${deal.amount.toLocaleString()} Funding Deal
              </h3>
              <p className="text-sm text-gray-600">{deal.description}</p>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(deal.status)}>
            {deal.status}
          </Badge>
        </div>
      </CardHeader>

      <CardBody>
        <div className="space-y-4">
          {/* Parties involved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <User className="text-blue-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Investor</p>
                <p className="font-medium text-gray-900">{investor?.name}</p>
                {investor?.role === 'investor' && (
                  <p className="text-xs text-gray-600">
                    {investor.portfolioCompanies.length} portfolio companies
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <User className="text-purple-600" size={16} />
              </div>
              <div>
                <p className="text-xs text-gray-500">Entrepreneur</p>
                <p className="font-medium text-gray-900">{entrepreneur?.name}</p>
                {entrepreneur?.role === 'entrepreneur' && (
                  <p className="text-xs text-gray-600">
                    {entrepreneur.startupName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Deal details */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar size={16} />
              <span>
                Created {new Date(deal.createdAt).toLocaleDateString()}
                {deal.fundedAt && (
                  <span className="ml-2">
                    • Funded {new Date(deal.fundedAt).toLocaleDateString()}
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {getStatusIcon(deal.status)}
              <span className="text-sm font-medium capitalize">{deal.status}</span>
            </div>
          </div>

          {/* Action buttons */}
          {deal.status === 'pending' && (
            <div className="flex space-x-2 pt-4">
              {isInvestor && onFund && (
                <Button
                  onClick={() => onFund(deal.id)}
                  className="flex-1"
                  leftIcon={<CheckCircle size={16} />}
                >
                  Fund Deal
                </Button>
              )}
              {isInvestor && onCancel && (
                <Button
                  variant="outline"
                  onClick={() => onCancel(deal.id)}
                  className="flex-1"
                  leftIcon={<XCircle size={16} />}
                >
                  Cancel
                </Button>
              )}
              {isEntrepreneur && (
                <div className="flex-1 text-center py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                  Waiting for investor approval
                </div>
              )}
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};