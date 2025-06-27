
import { SupportTicket, SupportAgent, SupportMetrics, SupportAnalytics, TicketMessage, KnowledgeBase } from './types';

export const mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    ticketNumber: 'TK-2024-001',
    customerId: 'cust-001',
    customerName: 'Aminul Islam',
    customerEmail: 'aminul@example.com',
    customerPhone: '+8801712345678',
    subject: 'Order delivery delayed',
    description: 'My order #ORD-12345 was supposed to be delivered yesterday but I haven\'t received it yet.',
    category: 'shipping_problem',
    priority: 'medium',
    status: 'in_progress',
    assignedTo: 'agent-001',
    assignedAgent: 'Rashida Khan',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    firstResponseTime: 45,
    orderNumber: 'ORD-12345',
    attachments: [],
    tags: ['delivery', 'urgent'],
    isEscalated: false,
    channel: 'email',
    language: 'en',
    lastActivity: '2024-01-15T14:20:00Z',
    responseCount: 3
  },
  {
    id: '2',
    ticketNumber: 'TK-2024-002',
    customerId: 'cust-002',
    customerName: 'Fatima Rahman',
    customerEmail: 'fatima@example.com',
    subject: 'Product quality issue',
    description: 'The phone I received has a cracked screen. I need a replacement.',
    category: 'product_inquiry',
    priority: 'high',
    status: 'open',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z',
    orderNumber: 'ORD-12346',
    productId: 'prod-001',
    attachments: ['crack-photo-1.jpg', 'crack-photo-2.jpg'],
    tags: ['defective', 'replacement'],
    isEscalated: false,
    channel: 'mobile_app',
    language: 'bn',
    lastActivity: '2024-01-15T09:15:00Z',
    responseCount: 0
  },
  {
    id: '3',
    ticketNumber: 'TK-2024-003',
    customerId: 'cust-003',
    customerName: 'Mohammed Hassan',
    customerEmail: 'hassan@example.com',
    subject: 'Refund not processed',
    description: 'I returned an item 10 days ago but haven\'t received my refund yet.',
    category: 'refund_request',
    priority: 'medium',
    status: 'waiting_customer',
    assignedTo: 'agent-002',
    assignedAgent: 'Karim Ahmed',
    createdAt: '2024-01-14T16:45:00Z',
    updatedAt: '2024-01-15T11:30:00Z',
    firstResponseTime: 120,
    resolutionTime: 1440,
    resolvedAt: '2024-01-15T16:45:00Z',
    orderNumber: 'ORD-12347',
    attachments: ['return-receipt.pdf'],
    tags: ['refund', 'processing'],
    satisfaction: {
      rating: 4,
      feedback: 'Good service, resolved quickly',
      createdAt: '2024-01-15T17:00:00Z'
    },
    isEscalated: false,
    channel: 'chat',
    language: 'en',
    lastActivity: '2024-01-15T16:45:00Z',
    responseCount: 5
  }
];

export const mockSupportAgents: SupportAgent[] = [
  {
    id: 'agent-001',
    name: 'Rashida Khan',
    email: 'rashida@company.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rashida',
    department: 'Customer Support',
    skills: ['Order Management', 'Shipping Issues', 'Payment Problems'],
    languages: ['English', 'Bengali'],
    status: 'online',
    activeTickets: 8,
    maxTickets: 15,
    rating: 4.8,
    totalResolved: 1247,
    avgResponseTime: 12,
    avgResolutionTime: 240
  },
  {
    id: 'agent-002',
    name: 'Karim Ahmed',
    email: 'karim@company.com',
    department: 'Technical Support',
    skills: ['Product Issues', 'Returns', 'Account Problems'],
    languages: ['English', 'Bengali', 'Hindi'],
    status: 'busy',
    activeTickets: 12,
    maxTickets: 15,
    rating: 4.6,
    totalResolved: 892,
    avgResponseTime: 18,
    avgResolutionTime: 320
  }
];

export const mockSupportMetrics: SupportMetrics = {
  totalTickets: 15420,
  openTickets: 234,
  resolvedTickets: 14986,
  avgResponseTime: 15.5,
  avgResolutionTime: 280,
  customerSatisfaction: 4.3,
  firstContactResolution: 78.5,
  escalationRate: 8.2,
  agentUtilization: 85.3,
  ticketsByCategory: [
    { category: 'Order Issues', count: 4626, percentage: 30 },
    { category: 'Product Inquiry', count: 3084, percentage: 20 },
    { category: 'Shipping Problems', count: 2313, percentage: 15 },
    { category: 'Payment Issues', count: 1854, percentage: 12 },
    { category: 'Refund Requests', count: 1542, percentage: 10 },
    { category: 'Technical Support', count: 1234, percentage: 8 },
    { category: 'Account Issues', count: 767, percentage: 5 }
  ],
  ticketsByPriority: [
    { priority: 'Low', count: 6168, percentage: 40 },
    { priority: 'Medium', count: 4626, percentage: 30 },
    { priority: 'High', count: 3084, percentage: 20 },
    { priority: 'Urgent', count: 1542, percentage: 10 }
  ],
  ticketsByStatus: [
    { status: 'Resolved', count: 14986, percentage: 97.2 },
    { status: 'Open', count: 234, percentage: 1.5 },
    { status: 'In Progress', count: 123, percentage: 0.8 },
    { status: 'Waiting Customer', count: 77, percentage: 0.5 }
  ],
  ticketsByChannel: [
    { channel: 'Email', count: 6168, percentage: 40 },
    { channel: 'Chat', count: 4626, percentage: 30 },
    { channel: 'Mobile App', count: 2313, percentage: 15 },
    { channel: 'Phone', count: 1542, percentage: 10 },
    { channel: 'Social Media', count: 771, percentage: 5 }
  ]
};

export const mockSupportAnalytics: SupportAnalytics = {
  dailyVolume: [
    { date: '2024-01-08', tickets: 45, resolved: 42, avgResponseTime: 12 },
    { date: '2024-01-09', tickets: 52, resolved: 48, avgResponseTime: 15 },
    { date: '2024-01-10', tickets: 38, resolved: 35, avgResponseTime: 10 },
    { date: '2024-01-11', tickets: 61, resolved: 58, avgResponseTime: 18 },
    { date: '2024-01-12', tickets: 43, resolved: 40, avgResponseTime: 14 },
    { date: '2024-01-13', tickets: 55, resolved: 52, avgResponseTime: 16 },
    { date: '2024-01-14', tickets: 47, resolved: 44, avgResponseTime: 13 }
  ],
  agentPerformance: [
    { agent: 'Rashida Khan', tickets: 67, resolved: 64, avgResponseTime: 12, customerRating: 4.8 },
    { agent: 'Karim Ahmed', tickets: 54, resolved: 52, avgResponseTime: 18, customerRating: 4.6 },
    { agent: 'Fatima Ali', tickets: 48, resolved: 45, avgResponseTime: 15, customerRating: 4.7 },
    { agent: 'Ahmed Hassan', tickets: 41, resolved: 38, avgResponseTime: 20, customerRating: 4.4 }
  ],
  categoryTrends: [
    { category: 'Order Issues', thisWeek: 45, lastWeek: 38, change: 18.4 },
    { category: 'Product Inquiry', thisWeek: 32, lastWeek: 35, change: -8.6 },
    { category: 'Shipping Problems', thisWeek: 28, lastWeek: 24, change: 16.7 },
    { category: 'Payment Issues', thisWeek: 19, lastWeek: 22, change: -13.6 }
  ],
  satisfactionTrends: [
    { month: 'Oct', rating: 4.1, responses: 1234 },
    { month: 'Nov', rating: 4.2, responses: 1456 },
    { month: 'Dec', rating: 4.3, responses: 1543 },
    { month: 'Jan', rating: 4.4, responses: 1234 }
  ]
};

export const mockTicketMessages: TicketMessage[] = [
  {
    id: 'msg-001',
    ticketId: '1',
    senderId: 'cust-001',
    senderName: 'Aminul Islam',
    senderType: 'customer',
    message: 'My order #ORD-12345 was supposed to be delivered yesterday but I haven\'t received it yet.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'msg-002',
    ticketId: '1',
    senderId: 'agent-001',
    senderName: 'Rashida Khan',
    senderType: 'agent',
    message: 'Thank you for contacting us. I\'m checking with our logistics partner about your order status.',
    attachments: [],
    isInternal: false,
    createdAt: '2024-01-15T11:15:00Z',
    readAt: '2024-01-15T11:20:00Z'
  }
];

export const mockKnowledgeBase: KnowledgeBase[] = [
  {
    id: 'kb-001',
    title: 'How to track your order',
    content: 'You can track your order by logging into your account and going to Order History...',
    category: 'Orders',
    tags: ['tracking', 'orders', 'delivery'],
    isPublic: true,
    views: 12450,
    helpful: 1123,
    notHelpful: 45,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    author: 'Support Team'
  },
  {
    id: 'kb-002',
    title: 'Return and Refund Policy',
    content: 'Our return policy allows you to return items within 30 days of purchase...',
    category: 'Returns',
    tags: ['returns', 'refunds', 'policy'],
    isPublic: true,
    views: 8932,
    helpful: 823,
    notHelpful: 67,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
    author: 'Legal Team'
  }
];
