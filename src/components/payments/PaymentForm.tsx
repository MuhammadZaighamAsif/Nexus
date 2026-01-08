import React, { useState } from 'react';
import { CreditCard, Lock, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardBody, CardHeader } from '../ui/Card';

interface PaymentFormProps {
  onSubmit: (data: PaymentData) => void;
  type: 'deposit' | 'withdraw' | 'transfer';
  maxAmount?: number;
}

export interface PaymentData {
  amount: number;
  description: string;
  recipientId?: string;
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  accountNumber?: string;
  routingNumber?: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  type,
  maxAmount
}) => {
  const [formData, setFormData] = useState<PaymentData>({
    amount: 0,
    description: '',
    recipientId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    accountNumber: '',
    routingNumber: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    onSubmit(formData);
    setIsProcessing(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <CreditCard size={24} className="text-blue-600" />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {type === 'deposit' ? 'Add Funds' : type === 'withdraw' ? 'Withdraw Funds' : 'Transfer Funds'}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Secure payment processing powered by Stripe
        </p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (USD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <Input
                type="number"
                value={formData.amount || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0
                }))}
                className="pl-8"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                max={maxAmount}
                required
              />
            </div>
            {maxAmount && (
              <p className="text-xs text-gray-500 mt-1">
                Maximum: ${maxAmount.toLocaleString()}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="What is this payment for?"
              required
            />
          </div>

          {/* Recipient for transfers */}
          {type === 'transfer' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient ID
              </label>
              <Input
                value={formData.recipientId}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  recipientId: e.target.value
                }))}
                placeholder="Enter recipient user ID"
                required
              />
            </div>
          )}

          {/* Payment Method */}
          {type === 'deposit' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>

              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    cardNumber: formatCardNumber(e.target.value)
                  }))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <Input
                    value={formData.expiryDate}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      expiryDate: formatExpiryDate(e.target.value)
                    }))}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <Input
                    type="password"
                    value={formData.cvv}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      cvv: e.target.value.replace(/[^0-9]/g, '').substring(0, 4)
                    }))}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bank Account for withdrawals */}
          {type === 'withdraw' && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Bank Account</h3>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Number
                </label>
                <Input
                  value={formData.accountNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    accountNumber: e.target.value.replace(/[^0-9]/g, '')
                  }))}
                  placeholder="Enter account number"
                  required
                />
              </div>

              {/* Routing Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routing Number
                </label>
                <Input
                  value={formData.routingNumber}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    routingNumber: e.target.value.replace(/[^0-9]/g, '').substring(0, 9)
                  }))}
                  placeholder="123456789"
                  maxLength={9}
                  required
                />
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Shield size={16} />
            <span>Your payment information is encrypted and secure</span>
            <Lock size={16} />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isProcessing || formData.amount <= 0}
            leftIcon={isProcessing ? undefined : <Lock size={18} />}
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : (
              `${type === 'deposit' ? 'Add' : type === 'withdraw' ? 'Withdraw' : 'Transfer'} $${formData.amount.toLocaleString()}`
            )}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};