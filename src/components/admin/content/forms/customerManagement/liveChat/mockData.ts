
import { ChatSession, ChatAgent, ChatMetrics, ChatAnalytics, ChatSettings } from './types';

export const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    sessionId: 'CHAT-2024-001',
    customerId: 'cust-001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah.johnson@email.com',
    customerAvatar: '👩‍💼',
    agentId: 'agent-001',
    agentName: 'Alex Chen',
    status: 'active',
    priority: 'high',
    startTime: '2024-01-15T10:30:00Z',
    duration: 1800,
    messageCount: 24,
    rating: 5,
    tags: ['order-issue', 'refund'],
    lastMessage: 'Thank you for your help with the refund process.',
    lastMessageTime: '2024-01-15T11:00:00Z',
    isFromMobile: true,
    customerLocation: 'New York, USA',
    orderNumber: 'ORD-2024-5678',
    category: 'Order Support',
    resolution: 'resolved'
  },
  {
    id: '2',
    sessionId: 'CHAT-2024-002',
    customerId: 'cust-002',
    customerName: 'Mohammed Rahman',
    customerEmail: 'mohammed.rahman@email.com',
    agentId: 'agent-002',
    agentName: 'Emma Wilson',
    status: 'waiting',
    priority: 'medium',
    startTime: '2024-01-15T11:15:00Z',
    duration: 600,
    messageCount: 8,
    tags: ['product-inquiry', 'shipping'],
    lastMessage: 'When will my order be shipped?',
    lastMessageTime: '2024-01-15T11:25:00Z',
    isFromMobile: false,
    customerLocation: 'London, UK',
    orderNumber: 'ORD-2024-5679',
    category: 'Shipping Inquiry',
    resolution: 'pending'
  },
  {
    id: '3',
    sessionId: 'CHAT-2024-003',
    customerId: 'cust-003',
    customerName: 'Li Wei',
    customerEmail: 'li.wei@email.com',
    customerAvatar: '👨‍💻',
    agentId: 'agent-003',
    agentName: 'James Rodriguez',
    status: 'ended',
    priority: 'low',
    startTime: '2024-01-15T09:45:00Z',
    endTime: '2024-01-15T10:15:00Z',
    duration: 1800,
    messageCount: 15,
    rating: 4,
    feedback: 'Quick response, helpful agent',
    tags: ['account-help', 'password-reset'],
    lastMessage: 'Your password has been reset successfully.',
    lastMessageTime: '2024-01-15T10:15:00Z',
    isFromMobile: true,
    customerLocation: 'Singapore',
    category: 'Account Support',
    resolution: 'resolved'
  }
];

export const mockChatAgents: ChatAgent[] = [
  {
    id: 'agent-001',
    name: 'Alex Chen',
    email: 'alex.chen@company.com',
    avatar: '👨‍💼',
    status: 'online',
    currentSessions: 3,
    maxSessions: 5,
    totalChatsToday: 28,
    averageResponseTime: 45,
    customerSatisfaction: 4.8,
    resolutionRate: 92,
    onlineTime: 480,
    languages: ['English', 'Mandarin'],
    specialties: ['Order Support', 'Returns'],
    lastActive: '2024-01-15T11:30:00Z',
    performance: {
      responsiveness: 95,
      helpfulness: 92,
      professionalism: 96
    }
  },
  {
    id: 'agent-002',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    avatar: '👩‍💼',
    status: 'busy',
    currentSessions: 4,
    maxSessions: 4,
    totalChatsToday: 22,
    averageResponseTime: 38,
    customerSatisfaction: 4.9,
    resolutionRate: 95,
    onlineTime: 465,
    languages: ['English', 'Spanish'],
    specialties: ['Technical Support', 'Product Info'],
    lastActive: '2024-01-15T11:28:00Z',
    performance: {
      responsiveness: 98,
      helpfulness: 94,
      professionalism: 97
    }
  },
  {
    id: 'agent-003',
    name: 'James Rodriguez',
    email: 'james.rodriguez@company.com',
    avatar: '👨‍🎓',
    status: 'online',
    currentSessions: 2,
    maxSessions: 6,
    totalChatsToday: 31,
    averageResponseTime: 52,
    customerSatisfaction: 4.7,
    resolutionRate: 89,
    onlineTime: 495,
    languages: ['English', 'Portuguese'],
    specialties: ['Account Support', 'Billing'],
    lastActive: '2024-01-15T11:32:00Z',
    performance: {
      responsiveness: 88,
      helpfulness: 91,
      professionalism: 93
    }
  }
];

export const mockChatMetrics: ChatMetrics = {
  totalActiveSessions: 8,
  waitingCustomers: 3,
  averageWaitTime: 2.5,
  averageResponseTime: 45,
  totalChatsToday: 156,
  resolvedChatsToday: 142,
  customerSatisfactionRate: 4.8,
  firstContactResolution: 87,
  agentsOnline: 12,
  totalAgents: 18,
  peakHours: [
    { hour: '09:00', sessions: 23 },
    { hour: '10:00', sessions: 31 },
    { hour: '11:00', sessions: 28 },
    { hour: '14:00', sessions: 35 },
    { hour: '15:00', sessions: 29 }
  ]
};

export const mockChatAnalytics: ChatAnalytics = {
  dailyStats: [
    {
      date: '2024-01-10',
      totalChats: 145,
      resolvedChats: 138,
      averageWaitTime: 3.2,
      customerSatisfaction: 4.7
    },
    {
      date: '2024-01-11',
      totalChats: 162,
      resolvedChats: 155,
      averageWaitTime: 2.8,
      customerSatisfaction: 4.8
    },
    {
      date: '2024-01-12',
      totalChats: 178,
      resolvedChats: 169,
      averageWaitTime: 2.1,
      customerSatisfaction: 4.9
    }
  ],
  hourlyDistribution: [
    { hour: '09:00', chatCount: 23, averageWaitTime: 2.1 },
    { hour: '10:00', chatCount: 31, averageWaitTime: 1.8 },
    { hour: '11:00', chatCount: 28, averageWaitTime: 2.3 },
    { hour: '14:00', chatCount: 35, averageWaitTime: 1.5 },
    { hour: '15:00', chatCount: 29, averageWaitTime: 2.0 }
  ],
  categoryBreakdown: [
    {
      category: 'Order Support',
      count: 45,
      percentage: 28.8,
      averageResolutionTime: 12.5
    },
    {
      category: 'Product Inquiry',
      count: 38,
      percentage: 24.4,
      averageResolutionTime: 8.2
    },
    {
      category: 'Technical Support',
      count: 32,
      percentage: 20.5,
      averageResolutionTime: 18.7
    },
    {
      category: 'Shipping Info',
      count: 25,
      percentage: 16.0,
      averageResolutionTime: 6.3
    },
    {
      category: 'Account Support',
      count: 16,
      percentage: 10.3,
      averageResolutionTime: 15.1
    }
  ],
  agentPerformance: [
    {
      agentId: 'agent-001',
      agentName: 'Alex Chen',
      totalChats: 28,
      averageRating: 4.8,
      responseTime: 45,
      resolutionRate: 92
    },
    {
      agentId: 'agent-002',
      agentName: 'Emma Wilson',
      totalChats: 22,
      averageRating: 4.9,
      responseTime: 38,
      resolutionRate: 95
    }
  ],
  customerSatisfactionTrends: [
    {
      month: 'Oct 2023',
      satisfaction: 4.6,
      responseTime: 52,
      resolutionRate: 85
    },
    {
      month: 'Nov 2023',
      satisfaction: 4.7,
      responseTime: 48,
      resolutionRate: 88
    },
    {
      month: 'Dec 2023',
      satisfaction: 4.8,
      responseTime: 45,
      resolutionRate: 91
    }
  ]
};

export const mockChatSettings: ChatSettings = {
  general: {
    chatEnabled: true,
    operatingHours: {
      start: '09:00',
      end: '18:00',
      timezone: 'UTC+8'
    },
    maxConcurrentChats: 5,
    autoAssignment: true,
    queueLimit: 50
  },
  automation: {
    autoGreeting: true,
    greetingMessage: 'Hello! How can we help you today?',
    prebotEnabled: true,
    prebotQuestions: [
      'What type of issue are you experiencing?',
      'Do you have an order number?',
      'What product are you asking about?'
    ],
    escalationRules: [
      {
        condition: 'Customer waiting > 5 minutes',
        action: 'Notify supervisor'
      },
      {
        condition: 'Customer satisfaction < 3',
        action: 'Escalate to senior agent'
      }
    ]
  },
  appearance: {
    chatWidgetColor: '#3B82F6',
    chatWidgetPosition: 'bottom-right',
    showAgentAvatar: true,
    showTypingIndicator: true
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notificationRecipients: ['supervisor@company.com', 'manager@company.com']
  }
};
