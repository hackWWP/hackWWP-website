import { createClient } from '@supabase/supabase-js'

// These will be environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for TypeScript
export interface User {
  id: string
  username: string
  email: string
  avatar_url?: string
  is_guest: boolean
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  user_id: string
  content: string
  message_type: 'text' | 'image' | 'system'
  status: 'sending' | 'sent' | 'delivered' | 'read'
  created_at: string
  updated_at: string
  // Message thread/conversation support
  thread_id?: string
  reply_to?: string
}

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  color?: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface MessageStatus {
  id: string
  message_id: string
  user_id: string
  status: 'delivered' | 'read'
  timestamp: string
}

// Database functions
export const createTables = async () => {
  // Users table
  await supabase.from('users').select('*').limit(1)
  
  // Messages table  
  await supabase.from('messages').select('*').limit(1)
  
  // Notes table
  await supabase.from('notes').select('*').limit(1)
  
  // Message status table for read receipts
  await supabase.from('message_status').select('*').limit(1)
}

// SQL schema for Supabase (run these in the Supabase SQL editor):
export const SQL_SCHEMA = `
-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_status ENABLE ROW LEVEL SECURITY;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    avatar_url TEXT,
    is_guest BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text',
    status VARCHAR(20) DEFAULT 'sent',
    thread_id UUID,
    reply_to UUID REFERENCES messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notes table  
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) DEFAULT 'Untitled Note',
    content TEXT NOT NULL DEFAULT '',
    color VARCHAR(20) DEFAULT 'yellow',
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Message status for read receipts
CREATE TABLE IF NOT EXISTS message_status (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- 'delivered', 'read'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(message_id, user_id, status)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_updated_at ON notes(updated_at);
CREATE INDEX IF NOT EXISTS idx_message_status_message_id ON message_status(message_id);

-- Row Level Security Policies
-- Users can only see their own data
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Messages policies (users can see all messages but only edit their own)
CREATE POLICY "Users can view all messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Users can insert their own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own messages" ON messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own messages" ON messages FOR DELETE USING (auth.uid() = user_id);

-- Notes policies (private to each user)
CREATE POLICY "Users can view their own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own notes" ON notes FOR DELETE USING (auth.uid() = user_id);

-- Message status policies
CREATE POLICY "Users can view message status" ON message_status FOR SELECT USING (true);
CREATE POLICY "Users can insert message status" ON message_status FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
`;