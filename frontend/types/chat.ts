// types/chat.ts

export interface Citation {
  title: string;
  snippet: string;
  source_link?: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  citations?: Citation[];
  confidence?: number;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isPinned?: boolean;
}

export interface Conversation {
  id: string;
  session_id: string;
  user_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  session_id?: string;
  user_id?: string;
}

export interface ChatResponse {
  reply: string;
  citations?: Citation[];
  confidence?: number;
  conversation_id: string;
  clarification_needed?: boolean;
}

export interface ChatInterfaceProps {
  chatId: string;
  onTitleUpdate?: (title: string) => void;
}

export interface MessageBubbleProps {
  message: Message;
}

export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isFirstMessage?: boolean;
}

export interface CitationListProps {
  citations: Citation[];
}