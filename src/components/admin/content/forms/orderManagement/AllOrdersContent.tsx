
import React, { useState } from 'react';
import { OrderStatsCards } from './components/OrderStatsCards';
import { OrderSearchFilters } from './components/OrderSearchFilters';
import { OrdersTable } from './components/OrdersTable';
import { OrderActionButtons } from './components/OrderActionButtons';

export const AllOrdersContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState('all');

  // Mock orders data (similar to Amazon/Shopee structure)
  const ordersData = [
    {
      id: 'ORD-2024-001',
      customer: 'Sarah Ahmed',
      email: 'sarah@email.com',
      phone: '+8801712345678',
      status: 'pending',
      paymentStatus: 'paid',
      paymentMethod: 'Mobile Banking',
      total: 2850,
      items: 3,
      orderDate: '2024-01-15T10:30:00Z',
      shippingAddress: 'Dhaka, Bangladesh',
      trackingNumber: 'TRK123456789',
      vendor: 'Tech Store BD',
      priority: 'high'
    },
    {
      id: 'ORD-2024-002',
      customer: 'Mohammad Rahman',
      email: 'rahman@email.com',
      phone: '+8801823456789',
      status: 'processing',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      total: 1650,
      items: 2,
      orderDate: '2024-01-15T09:15:00Z',
      shippingAddress: 'Chittagong, Bangladesh',
      trackingNumber: 'TRK123456790',
      vendor: 'Fashion Hub',
      priority: 'medium'
    },
    {
      id: 'ORD-2024-003',
      customer: 'Fatima Khan',
      email: 'fatima@email.com',
      phone: '+8801934567890',
      status: 'shipped',
      paymentStatus: 'paid',
      paymentMethod: 'Cash on Delivery',
      total: 3200,
      items: 5,
      orderDate: '2024-01-14T14:20:00Z',
      shippingAddress: 'Sylhet, Bangladesh',
      trackingNumber: 'TRK123456791',
      vendor: 'Home Essentials',
      priority: 'low'
    },
    {
      id: 'ORD-2024-004',
      customer: 'Ahmed Hassan',
      email: 'ahmed@email.com',
      phone: '+8801645678901',
      status: 'delivered',
      paymentStatus: 'paid',
      paymentMethod: 'bKash',
      total: 850,
      items: 1,
      orderDate: '2024-01-13T16:45:00Z',
      shippingAddress: 'Rajshahi, Bangladesh',
      trackingNumber: 'TRK123456792',
      vendor: 'Books & More',
      priority: 'medium'
    },
    {
      id: 'ORD-2024-005',
      customer: 'Nusrat Jahan',
      email: 'nusrat@email.com',
      phone: '+8801756789012',
      status: 'cancelled',
      paymentStatus: 'refunded',
      paymentMethod: 'Nagad',
      total: 1200,
      items: 2,
      orderDate: '2024-01-12T11:30:00Z',
      shippingAddress: 'Khulna, Bangladesh',
      trackingNumber: '',
      vendor: 'Electronics Pro',
      priority: 'high'
    }
  ];

  const statusCounts = {
    all: ordersData.length,
    pending: ordersData.filter(o => o.status === 'pending').length,
    processing: ordersData.filter(o => o.status === 'processing').length,
    shipped: ordersData.filter(o => o.status === 'shipped').length,
    delivered: ordersData.filter(o => o.status === 'delivered').length,
    cancelled: ordersData.filter(o => o.status === 'cancelled').length,
  };

  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = currentTab === 'all' || order.status === currentTab;
    return matchesSearch && matchesStatus;
  });

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
        </div>
        <OrderActionButtons />
      </div>

      {/* Quick Stats Cards */}
      <OrderStatsCards statusCounts={statusCounts} />

      {/* Search and Filters */}
      <OrderSearchFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      {/* Orders Table with Tabs */}
      <OrdersTable
        filteredOrders={filteredOrders}
        selectedOrders={selectedOrders}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        statusCounts={statusCounts}
        handleSelectOrder={handleSelectOrder}
        handleSelectAll={handleSelectAll}
      />
    </div>
  );
};
