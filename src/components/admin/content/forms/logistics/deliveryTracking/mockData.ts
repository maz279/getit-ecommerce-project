
import { DeliveryItem } from './types';

export const mockDeliveryData: DeliveryItem[] = [
  {
    id: '1',
    trackingNumber: 'TRK001234567',
    orderId: 'ORD-2024-001',
    customerName: 'Ahmed Rahman',
    customerPhone: '+880-1712-345678',
    deliveryAddress: 'House 123, Road 15, Dhanmondi, Dhaka-1205',
    status: 'out_for_delivery',
    courierPartner: 'Pathao Courier',
    courierDriver: 'Karim Uddin',
    driverPhone: '+880-1798-876543',
    estimatedDelivery: '2024-01-15 18:00',
    priority: 'express',
    packageValue: 2500,
    deliveryInstructions: 'Call before delivery. Ring bell twice.',
    currentLocation: 'Dhanmondi Hub',
    lastUpdated: '2024-01-15 15:30',
    timeline: [
      { timestamp: '2024-01-15 09:00', status: 'Picked Up', location: 'Warehouse Dhaka', description: 'Package picked up from vendor' },
      { timestamp: '2024-01-15 12:00', status: 'In Transit', location: 'Sorting Center', description: 'Package sorted for delivery' },
      { timestamp: '2024-01-15 15:00', status: 'Out for Delivery', location: 'Dhanmondi Hub', description: 'Out for delivery with Karim Uddin' }
    ]
  },
  {
    id: '2',
    trackingNumber: 'TRK001234568',
    orderId: 'ORD-2024-002',
    customerName: 'Fatima Khatun',
    customerPhone: '+880-1823-456789',
    deliveryAddress: 'Flat 4B, Building 12, Gulshan-2, Dhaka-1212',
    status: 'delivered',
    courierPartner: 'RedX Delivery',
    courierDriver: 'Milon Hasan',
    driverPhone: '+880-1987-654321',
    estimatedDelivery: '2024-01-15 16:00',
    actualDelivery: '2024-01-15 15:45',
    priority: 'same_day',
    packageValue: 4200,
    currentLocation: 'Delivered',
    lastUpdated: '2024-01-15 15:45',
    timeline: [
      { timestamp: '2024-01-15 10:00', status: 'Picked Up', location: 'Warehouse Dhaka', description: 'Package picked up from vendor' },
      { timestamp: '2024-01-15 13:00', status: 'In Transit', location: 'Gulshan Hub', description: 'Package reached Gulshan hub' },
      { timestamp: '2024-01-15 14:30', status: 'Out for Delivery', location: 'Gulshan Hub', description: 'Out for delivery with Milon Hasan' },
      { timestamp: '2024-01-15 15:45', status: 'Delivered', location: 'Customer Address', description: 'Package delivered successfully' }
    ]
  },
  {
    id: '3',
    trackingNumber: 'TRK001234569',
    orderId: 'ORD-2024-003',
    customerName: 'Mohammad Ali',
    customerPhone: '+880-1645-789123',
    deliveryAddress: 'Shop 45, New Market, Dhaka-1205',
    status: 'delayed',
    courierPartner: 'Steadfast Courier',
    courierDriver: 'Rashid Ahmed',
    driverPhone: '+880-1876-543210',
    estimatedDelivery: '2024-01-15 14:00',
    priority: 'normal',
    packageValue: 1800,
    deliveryInstructions: 'Deliver to shop counter',
    currentLocation: 'New Market Area',
    lastUpdated: '2024-01-15 16:00',
    timeline: [
      { timestamp: '2024-01-15 08:00', status: 'Picked Up', location: 'Warehouse Dhaka', description: 'Package picked up from vendor' },
      { timestamp: '2024-01-15 11:00', status: 'In Transit', location: 'Central Hub', description: 'Package in transit' },
      { timestamp: '2024-01-15 16:00', status: 'Delayed', location: 'New Market Area', description: 'Delivery delayed due to traffic congestion' }
    ]
  }
];
