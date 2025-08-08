// Chat-related TypeScript interfaces

export interface Citation {
  title: string;
  snippet: string;
  source_link?: string;
}

/**
 * Represents a chat message from the backend.
 */
export interface Message {
  id: number;
  conversation: number;
  sender: 'user' | 'bot' | 'system';
  message_type: 'text' | 'clarification' | 'options' | 'confirmation' | 'error' | 'system_info';
  text: string;
  citations?: Citation[];
  confidence?: number;
  intent?: string;
  entities?: Record<string, any>;
  processing_time?: number;
  ai_model_version?: string;
  clarification_needed?: boolean;
  clarification_type?: 'location' | 'incident_type' | 'contact_info' | 'general';
  is_helpful?: boolean;
  feedback_text?: string;
  created_at: string;
  updated_at: string;
  trace_id?: string;
}

/**
 * Conversation state for complex multi-turn interactions
 */
export interface ConversationState {
  current_state: string;
  expected_input: string;
  state_data: Record<string, any>;
  retry_count: number;
  max_retries: number;
}

/**
 * Conversation model from the backend
 */
export interface Conversation {
  id: number;
  session_id: string;
  title: string;
  language: 'en' | 'sw';
  location_context: Record<string, any>;
  conversation_context: Record<string, any>;
  is_active: boolean;
  is_resolved: boolean;
  resolution_type?: 'answered' | 'incident_created' | 'status_checked' | 'escalated' | 'abandoned';
  total_messages: number;
  average_response_time?: number;
  user_satisfaction?: number;
  can_be_shared: boolean;
  created_at: string;
  updated_at: string;
  messages: Message[];
  state?: ConversationState;
}

export interface ConversationList {
  id: number;
  session_id: string;
  title: string;
  language: 'en' | 'sw';
  is_active: boolean;
  is_resolved: boolean;
  resolution_type?: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  latest_message?: {
    text: string;
    sender: string;
    created_at: string;
  };
}

/**
 * Create conversation request
 */
export interface CreateConversationRequest {
  language?: 'en' | 'sw';
  location_context?: Record<string, any>;
  initial_message: string;
  title?: string;
}

/**
 * Send message request
 */
export interface SendMessageRequest {
  text: string;
  message_type?: 'text' | 'clarification' | 'options' | 'confirmation' | 'error' | 'system_info';
  preferred_provider?: string;
  preferred_model?: string;
}

/**
 * Chat response from AI
 */
export interface ChatResponse {
  message: Message;
  conversation: Conversation;
  requires_clarification: boolean;
  clarification_prompt?: string;
  suggested_actions: string[];
}

/**
 * User feedback
 */
export interface UserFeedback {
  id: number;
  conversation: number;
  message?: number;
  feedback_type: 'rating' | 'thumbs' | 'detailed';
  rating?: number;
  is_positive?: boolean;
  feedback_text?: string;
  categories?: string[];
  created_at?: string;
}

/**
 * Conversation analytics
 */
export interface ConversationAnalytics {
  total_conversations: number;
  active_conversations: number;
  resolved_conversations: number;
  average_messages_per_conversation: number;
  average_response_time: number;
  satisfaction_score: number;
  common_intents: Array<{ intent: string; count: number }>;
  resolution_types: Record<string, number>;
}

// Frontend-specific interfaces
export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isPinned: boolean;
}

export interface ChatInterfaceProps {
  chatId: string;
  onTitleUpdate?: (title: string) => void;
}

export interface MessageBubbleProps {
  message: Message;
}

export interface ChatInputProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
  isFirstMessage?: boolean;
}

export interface CitationListProps {
  citations: Citation[];
}