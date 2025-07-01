-- Create chat rooms table
CREATE TABLE public.chat_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user presence table
CREATE TABLE public.user_presence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  room_id UUID REFERENCES public.chat_rooms(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'offline',
  last_seen TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Chat rooms policies
CREATE POLICY "Users can view public chat rooms" 
ON public.chat_rooms FOR SELECT 
USING (NOT is_private OR created_by = auth.uid());

CREATE POLICY "Users can create chat rooms" 
ON public.chat_rooms FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own chat rooms" 
ON public.chat_rooms FOR UPDATE 
USING (auth.uid() = created_by);

-- Chat messages policies
CREATE POLICY "Users can view messages in accessible rooms" 
ON public.chat_messages FOR SELECT 
USING (
  room_id IN (
    SELECT id FROM public.chat_rooms 
    WHERE NOT is_private OR created_by = auth.uid()
  )
);

CREATE POLICY "Authenticated users can send messages" 
ON public.chat_messages FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own messages" 
ON public.chat_messages FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own messages" 
ON public.chat_messages FOR DELETE 
USING (auth.uid() = user_id);

-- User presence policies
CREATE POLICY "Users can view presence in accessible rooms" 
ON public.user_presence FOR SELECT 
USING (
  room_id IN (
    SELECT id FROM public.chat_rooms 
    WHERE NOT is_private OR created_by = auth.uid()
  ) OR user_id = auth.uid()
);

CREATE POLICY "Users can manage their own presence" 
ON public.user_presence FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Enable realtime for tables
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER TABLE public.user_presence REPLICA IDENTITY FULL;
ALTER TABLE public.chat_rooms REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_rooms;

-- Create indexes for better performance
CREATE INDEX idx_chat_messages_room_id ON public.chat_messages(room_id);
CREATE INDEX idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX idx_user_presence_room_id ON public.user_presence(room_id);
CREATE INDEX idx_user_presence_user_id ON public.user_presence(user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_chat_rooms_updated_at
    BEFORE UPDATE ON public.chat_rooms
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_chat_messages_updated_at
    BEFORE UPDATE ON public.chat_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default chat rooms
INSERT INTO public.chat_rooms (name, description, is_private, created_by) VALUES
('General', 'General discussion for all users', false, (SELECT id FROM auth.users LIMIT 1)),
('Product Support', 'Get help with products and orders', false, (SELECT id FROM auth.users LIMIT 1)),
('Vendor Chat', 'Chat room for vendors and suppliers', false, (SELECT id FROM auth.users LIMIT 1));