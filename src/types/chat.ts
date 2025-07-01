export interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  is_private: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  message_text: string;
  message_type: 'text' | 'image' | 'file';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}

export interface UserPresence {
  id: string;
  user_id: string;
  room_id?: string;
  status: 'online' | 'offline' | 'away';
  last_seen: string;
  metadata: Record<string, any>;
  user?: {
    id: string;
    email: string;
    full_name?: string;
  };
}