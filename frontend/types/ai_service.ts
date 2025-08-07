/**
 * Represents an AI provider.
 */
export interface AIProvider {
  id: number;
  name: string;
  provider_type: 'openai' | 'google' | 'ollama' | 'anthropic' | 'custom';
  default_model?: number;
  available_models: string[];
  requests_per_minute?: number;
  tokens_per_minute?: number;
  default_temperature?: number;
  max_tokens?: number;
  is_active: boolean;
  is_primary: boolean;
  last_health_check?: string;
  is_healthy: boolean;
  model_count: number;
  is_available: boolean;
}

/**
 * Represents an AI model.
 */
export interface AIModel {
  id: number;
  name: string;
  provider: number;
  provider_name: string;
  model_id: string;
  purpose: string;
  supports_streaming: boolean;
  supports_functions: boolean;
  context_window?: number;
  default_temperature?: number;
  default_max_tokens?: number;
  default_top_p?: number;
  input_cost_per_token?: number;
  output_cost_per_token?: number;
  is_active: boolean;
}

/**
 * Represents a message in an AI conversation.
 */
export interface AIMessage {
  id: number;
  role: 'user' | 'assistant' | 'system' | 'function';
  content: string;
  input_tokens?: number;
  output_tokens?: number;
  function_name?: string;
  function_arguments?: any;
  function_result?: any;
  response_time_ms?: number;
  model_used?: string;
  temperature_used?: number;
  is_processed: boolean;
  processing_error?: string;
  cited_articles: KnowledgeArticleSummary[];
  cited_faqs: FAQ[];
  created_at: string;
}

/**
 * Represents a summary of an AI conversation for list views.
 */
export interface AIConversationSummary {
  session_id: string;
  conversation_type: string;
  model_name: string;
  is_active: boolean;
  last_activity: string;
  total_messages: number;
  total_tokens_used: number;
  satisfaction_rating?: number;
  last_message?: {
    content: string;
    created_at: string;
  };
  created_at: string;
}

/**
 * Represents a detailed view of an AI conversation.
 */
export interface AIConversation {
  session_id: string;
  conversation_type: string;
  model: AIModel;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  is_active: boolean;
  last_activity: string;
  total_messages: number;
  total_tokens_used: number;
  satisfaction_rating?: number;
  satisfaction_feedback?: string;
  context_data: any;
  metadata: any;
  messages: AIMessage[];
  created_at: string;
  updated_at: string;
}

/**
 * Represents the data required to create an AI conversation.
 */
export interface CreateAIConversationData {
  conversation_type: string;
  model: number;
  system_prompt?: string;
  temperature?: number;
  max_tokens?: number;
  context_data?: any;
  initial_message: string;
}

/**
 * Represents the data required to send a message in an AI conversation.
 */
export interface SendMessageData {
  content: string;
  function_name?: string;
  function_arguments?: any;
}

/**
 * Represents a prompt template for AI models.
 */
export interface AIPromptTemplate {
  id: number;
  name: string;
  template_type: string;
  description?: string;
  template: string;
  variables: string[];
  purpose: string;
  model_compatibility: string[];
  default_temperature?: number;
  default_max_tokens?: number;
  is_active: boolean;
  version: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents feedback on an AI interaction.
 */
export interface AIFeedback {
  feedback_type: 'rating' | 'thumbs' | 'detailed';
  rating?: number;
  comment?: string;
  created_at: string;
}

/**
 * Represents usage metrics for the AI service.
 */
export interface AIUsageMetrics {
  date: string;
  total_conversations: number;
  total_messages: number;
  unique_users: number;
  total_input_tokens: number;
  total_output_tokens: number;
  avg_response_time_ms: number;
  error_rate: number;
  estimated_cost: number;
  conversation_type_breakdown: any;
  model_usage_breakdown: any;
  avg_satisfaction_rating?: number;
  satisfaction_response_count: number;
}

import { KnowledgeArticleSummary, FAQ } from "../types/knowledge_base";