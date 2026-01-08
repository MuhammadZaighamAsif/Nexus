import { Transaction, Wallet, FundingDeal } from '../types';

export const transactions: Transaction[] = [
  {
    id: 't1',
    type: 'deposit',
    amount: 5000,
    receiverId: 'i1',
    description: 'Bank deposit',
    status: 'completed',
    createdAt: '2024-01-01T10:00:00Z',
    completedAt: '2024-01-01T10:05:00Z'
  },
  {
    id: 't2',
    type: 'transfer',
    amount: 2500,
    senderId: 'i1',
    receiverId: 'e1',
    description: 'Investment in TechWave AI',
    status: 'completed',
    createdAt: '2024-01-02T14:30:00Z',
    completedAt: '2024-01-02T14:35:00Z'
  },
  {
    id: 't3',
    type: 'funding',
    amount: 10000,
    senderId: 'i2',
    receiverId: 'e2',
    description: 'Seed funding for GreenLife Solutions',
    status: 'completed',
    createdAt: '2024-01-03T09:15:00Z',
    completedAt: '2024-01-03T09:20:00Z'
  },
  {
    id: 't4',
    type: 'withdraw',
    amount: 1000,
    senderId: 'e1',
    description: 'Cash withdrawal',
    status: 'completed',
    createdAt: '2024-01-04T16:45:00Z',
    completedAt: '2024-01-04T16:50:00Z'
  },
  {
    id: 't5',
    type: 'deposit',
    amount: 7500,
    receiverId: 'i3',
    description: 'Investment capital deposit',
    status: 'completed',
    createdAt: '2024-01-05T11:20:00Z',
    completedAt: '2024-01-05T11:25:00Z'
  },
  {
    id: 't6',
    type: 'transfer',
    amount: 3000,
    senderId: 'i3',
    receiverId: 'e3',
    description: 'Series A investment in HealthPulse',
    status: 'pending',
    createdAt: '2024-01-06T13:10:00Z'
  },
  {
    id: 't7',
    type: 'funding',
    amount: 5000,
    senderId: 'i1',
    receiverId: 'e4',
    description: 'Funding for UrbanFarm expansion',
    status: 'completed',
    createdAt: '2024-01-07T08:30:00Z',
    completedAt: '2024-01-07T08:35:00Z'
  }
];

export const wallets: Wallet[] = [
  {
    userId: 'i1',
    balance: 22500,
    currency: 'USD',
    lastUpdated: '2024-01-07T10:00:00Z'
  },
  {
    userId: 'i2',
    balance: 15000,
    currency: 'USD',
    lastUpdated: '2024-01-07T10:00:00Z'
  },
  {
    userId: 'i3',
    balance: 4500,
    currency: 'USD',
    lastUpdated: '2024-01-07T10:00:00Z'
  },
  {
    userId: 'e1',
    balance: 1500,
    currency: 'USD',
    lastUpdated: '2024-01-07T10:00:00Z'
  },
  {
    userId: 'e2',
    balance: 10000,
    currency: 'USD',
    lastUpdated: '2024-01-07T10:00:00Z'
  },
  {
    userId: 'e3',
    balance: 0,
    currency: 'USD',
    lastUpdated: '2024-01-07T10:00:00Z'
  },
  {
    userId: 'e4',
    balance: 5000,
    currency: 'USD',
    lastUpdated: '2024-01-07T10:00:00Z'
  }
];

export const fundingDeals: FundingDeal[] = [
  {
    id: 'fd1',
    investorId: 'i1',
    entrepreneurId: 'e1',
    amount: 2500,
    description: 'Seed investment for TechWave AI development',
    status: 'funded',
    createdAt: '2024-01-02T14:00:00Z',
    fundedAt: '2024-01-02T14:35:00Z'
  },
  {
    id: 'fd2',
    investorId: 'i2',
    entrepreneurId: 'e2',
    amount: 10000,
    description: 'Funding for GreenLife Solutions production scaling',
    status: 'funded',
    createdAt: '2024-01-03T09:00:00Z',
    fundedAt: '2024-01-03T09:20:00Z'
  },
  {
    id: 'fd3',
    investorId: 'i3',
    entrepreneurId: 'e3',
    amount: 3000,
    description: 'Investment in HealthPulse platform expansion',
    status: 'pending',
    createdAt: '2024-01-06T13:00:00Z'
  },
  {
    id: 'fd4',
    investorId: 'i1',
    entrepreneurId: 'e4',
    amount: 5000,
    description: 'Funding for UrbanFarm IoT system development',
    status: 'funded',
    createdAt: '2024-01-07T08:00:00Z',
    fundedAt: '2024-01-07T08:35:00Z'
  }
];

// Helper functions
export const getTransactionsForUser = (userId: string): Transaction[] => {
  return transactions.filter(tx =>
    tx.senderId === userId || tx.receiverId === userId
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getWalletForUser = (userId: string): Wallet | null => {
  return wallets.find(wallet => wallet.userId === userId) || null;
};

export const getFundingDealsForUser = (userId: string): FundingDeal[] => {
  return fundingDeals.filter(deal =>
    deal.investorId === userId || deal.entrepreneurId === userId
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};