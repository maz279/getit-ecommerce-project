
import { VIPCustomer, SpendingTrendData, TierDistributionData } from './types';

export const vipCustomersData: VIPCustomer[] = [
  { 
    id: 1, 
    name: 'Sarah Johnson', 
    email: 'sarah.j@email.com', 
    phone: '+1-555-0123',
    tier: 'Platinum', 
    lifetimeValue: 15000, 
    totalOrders: 45, 
    joinDate: '2022-01-15',
    lastOrder: '2024-06-20',
    personalShopper: 'Emma Wilson',
    preferredCategories: ['Electronics', 'Fashion'],
    status: 'Active'
  },
  { 
    id: 2, 
    name: 'Michael Chen', 
    email: 'm.chen@email.com', 
    phone: '+1-555-0124',
    tier: 'Diamond', 
    lifetimeValue: 25000, 
    totalOrders: 68, 
    joinDate: '2021-08-10',
    lastOrder: '2024-06-22',
    personalShopper: 'James Smith',
    preferredCategories: ['Home & Garden', 'Books'],
    status: 'Active'
  },
  { 
    id: 3, 
    name: 'Emily Rodriguez', 
    email: 'e.rodriguez@email.com', 
    phone: '+1-555-0125',
    tier: 'Gold', 
    lifetimeValue: 8500, 
    totalOrders: 32, 
    joinDate: '2022-03-22',
    lastOrder: '2024-06-18',
    personalShopper: 'Lisa Anderson',
    preferredCategories: ['Beauty', 'Health'],
    status: 'Active'
  },
];

export const spendingTrendData: SpendingTrendData[] = [
  { month: 'Jan', amount: 12000 },
  { month: 'Feb', amount: 15000 },
  { month: 'Mar', amount: 18000 },
  { month: 'Apr', amount: 22000 },
  { month: 'May', amount: 19000 },
  { month: 'Jun', amount: 25000 },
];

export const tierDistributionData: TierDistributionData[] = [
  { name: 'Diamond', value: 15, color: '#8B5CF6' },
  { name: 'Platinum', value: 25, color: '#06B6D4' },
  { name: 'Gold', value: 40, color: '#F59E0B' },
  { name: 'Silver', value: 20, color: '#6B7280' },
];
