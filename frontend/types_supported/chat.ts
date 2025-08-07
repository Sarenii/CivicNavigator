/**
 * Represents a chat message.
 */
export interface Message {
  id: number;
  sender: 'user' | 'bot';
  message_type: string;
  text: string;
  citations?: string[];
  confidence?: number;
  intent?: string;
  entities?: any;
  processing_time?: number;
  ai_model_version?: string;
  clarification_needed?: boolean;
  clarification_type?: string;
  is_helpful?: boolean;
  feedback_text?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents the state of a conversation.
 */
export interface ConversationState {
  current_state: string;
  expected_input?: string;
  state_data?: any;
  retry_count: number;
  max_retries?: number;
}

/**
 * Represents a detailed view of a conversation.
 */
export interface ConversationDetail {
  id: number;
  session_id: string;
  title?: string;
  language: string;
  location_context?: any;
  conversation_context?: any;
  is_active: boolean;
  is_resolved: boolean;
  resolution_type?: string;
  total_messages: number;
  average_response_time?: number;
  user_satisfaction?: number;
  can_be_shared: boolean;
  created_at: string;
  updated_at: string;
  messages: Message[];
  state?: ConversationState;
}

/**
 * Represents a simplified view of a conversation for lists.
 */
export interface ConversationList {
  id: number;
  session_id: string;
  title?: string;
  language: string;
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
 * Represents data for creating a new conversation.
 */
export interface CreateConversationData {
  language?: string;
  location_context?: any;
  initial_message: string;
  title?: string;
}

/**
 * Represents data for sending a message within a conversation.
 */
export interface SendMessageData {
  text: string;
  message_type?: string;
  preferred_provider?: string;
  preferred_model?: string;
}

/**
 * Represents user feedback on a message or conversation.
 */
export interface UserFeedback {
  id: number;
  feedback_type: string;
  rating?: number;
  is_positive?: boolean;
  feedback_text?: string;
  categories?: string[];
  created_at: string;
}

/**
 * Represents an AI chat response.
 */
export interface ChatResponse {
  message: Message;
  conversation: ConversationDetail;
  requires_clarification: boolean;
  clarification_prompt?: string;
  suggested_actions: string[];
}

/**
 * Represents conversation analytics data.
 */
export interface ConversationAnalytics {
  total_conversations: number;
  active_conversations: number;
  resolved_conversations: number;
  average_messages_per_conversation: number;
  average_response_time: number;
  satisfaction_score: number;
  common_intents: any[];
  resolution_types: any;
}