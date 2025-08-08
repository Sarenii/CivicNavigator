import { useApi } from '@/hooks/useApi';
import { 
  Conversation, 
  ConversationList, 
  CreateConversationRequest, 
  SendMessageRequest, 
  ChatResponse, 
  UserFeedback,
  ConversationAnalytics,
  Message
} from '../../types/chat';
import { 
  START_CONVERSATION_URL, 
  CONVERSATION_LIST_URL, 
  CONVERSATION_DETAIL_URL, 
  SEND_MESSAGE_URL, 
  SUBMIT_FEEDBACK_URL,
  RESOLVE_CONVERSATION_URL,
  CHAT_ANALYTICS_URL
} from '../../handler/apiConfig';

// Hook for starting a new conversation
export const useStartConversation = () => {
  const { useAddItem } = useApi<CreateConversationRequest, Conversation>(START_CONVERSATION_URL);
  return useAddItem;
};

// Hook for fetching conversation list
export const useConversationList = (params?: Record<string, string | boolean>) => {
  const { useFetchData } = useApi<ConversationList, ConversationList>(CONVERSATION_LIST_URL);
  return useFetchData(1, params);
};

// Hook for fetching conversation details
export const useConversationDetail = (sessionId: string) => {
  const { useFetchById } = useApi<Conversation, Conversation>(CONVERSATION_DETAIL_URL(sessionId));
  return useFetchById('');
};

// Hook for sending a message with improved cache invalidation
export const useSendMessage = (sessionId: string) => {
  const { useAddItem } = useApi<SendMessageRequest, ChatResponse>(SEND_MESSAGE_URL(sessionId));
  
  // Create a custom mutation that invalidates related queries
  const mutation = useAddItem;
  
  // Override the onSuccess callback to invalidate conversation data
  if (mutation.mutateAsync) {
    const originalMutateAsync = mutation.mutateAsync;
    mutation.mutateAsync = async (arg: any) => {
      try {
        const result = await originalMutateAsync(arg);
        // The useApi hook already invalidates the URL-specific queries
        // Additional invalidation can be added here if needed
        return result;
      } catch (error) {
        throw error;
      }
    };
  }
  
  return mutation;
};

// Hook for submitting feedback
export const useSubmitFeedback = (sessionId: string) => {
  const { useAddItem } = useApi<Partial<UserFeedback>, UserFeedback>(SUBMIT_FEEDBACK_URL(sessionId));
  return useAddItem;
};

// Hook for resolving a conversation
export const useResolveConversation = (sessionId: string) => {
  const { useAddItem } = useApi<{ resolution_type: string }, Conversation>(RESOLVE_CONVERSATION_URL(sessionId));
  return useAddItem;
};

// Hook for fetching chat analytics (admin only)
export const useChatAnalytics = (days: number = 30) => {
  const { useFetchData } = useApi<ConversationAnalytics, ConversationAnalytics>(CHAT_ANALYTICS_URL);
  return useFetchData(1, { days });
};

// Hook for updating conversation details
export const useUpdateConversation = (sessionId: string) => {
  const { useUpdateItem } = useApi<Partial<Conversation>, Conversation>(CONVERSATION_DETAIL_URL(sessionId));
  return useUpdateItem;
};

// Hook for deleting a conversation
export const useDeleteConversation = (sessionId: string) => {
  const { useDeleteItem } = useApi<Conversation, Conversation>(CONVERSATION_DETAIL_URL(sessionId));
  return useDeleteItem;
};

// Hook for fetching conversation messages
export const useConversationMessages = (sessionId: string) => {
  const { useFetchData } = useApi<Message, Message>(`${CONVERSATION_DETAIL_URL(sessionId)}messages/`);
  return useFetchData(1);
};

// Hook for marking message as helpful/unhelpful
export const useMessageFeedback = (sessionId: string, messageId: number) => {
  const { useUpdateItem } = useApi<{ is_helpful: boolean }, Message>(`${CONVERSATION_DETAIL_URL(sessionId)}messages/${messageId}/`);
  return useUpdateItem;
};

// Hook for getting conversation suggestions
export const useConversationSuggestions = (sessionId: string) => {
  const { useFetchData } = useApi<{ suggestions: string[] }, { suggestions: string[] }>(`${CONVERSATION_DETAIL_URL(sessionId)}suggestions/`);
  return useFetchData(1);
};

// Hook for exporting conversation
export const useExportConversation = (sessionId: string, format: 'pdf' | 'json' = 'pdf') => {
  const { useFetchData } = useApi<{ download_url: string }, { download_url: string }>(`${CONVERSATION_DETAIL_URL(sessionId)}export/`);
  return useFetchData(1, { format });
};

// Hook for sharing conversation
export const useShareConversation = (sessionId: string) => {
  const { useAddItem } = useApi<{ share_type: string; recipients: string[] }, { share_url: string }>(`${CONVERSATION_DETAIL_URL(sessionId)}share/`);
  return useAddItem;
};

// Hook for getting conversation insights
export const useConversationInsights = (sessionId: string) => {
  const { useFetchData } = useApi<{
    sentiment: string;
    topics: string[];
    entities: Record<string, any>;
    summary: string;
  }, {
    sentiment: string;
    topics: string[];
    entities: Record<string, any>;
    summary: string;
  }>(`${CONVERSATION_DETAIL_URL(sessionId)}insights/`);
  return useFetchData(1);
};

// Hook for conversation search
export const useConversationSearch = (query: string) => {
  const { useFetchData } = useApi<ConversationList, ConversationList>(`${CONVERSATION_LIST_URL}search/`);
  return useFetchData(1, { q: query });
};

// Hook for conversation filters
export const useConversationFilters = (filters: {
  date_from?: string;
  date_to?: string;
  language?: string;
  is_resolved?: boolean;
  resolution_type?: string;
}) => {
  const { useFetchData } = useApi<ConversationList, ConversationList>(CONVERSATION_LIST_URL);
  return useFetchData(1, filters);
};

// Hook for conversation statistics
export const useConversationStats = () => {
  const { useFetchData } = useApi<{
    total_conversations: number;
    active_conversations: number;
    resolved_conversations: number;
    average_response_time: number;
    satisfaction_score: number;
  }, {
    total_conversations: number;
    active_conversations: number;
    resolved_conversations: number;
    average_response_time: number;
    satisfaction_score: number;
  }>(`${CONVERSATION_LIST_URL}stats/`);
  return useFetchData(1);
};

// Hook for conversation templates
export const useConversationTemplates = () => {
  const { useFetchData } = useApi<{
    id: number;
    name: string;
    description: string;
    initial_message: string;
    category: string;
  }, {
    id: number;
    name: string;
    description: string;
    initial_message: string;
    category: string;
  }>(`${CONVERSATION_LIST_URL}templates/`);
  return useFetchData(1);
};

// Hook for starting conversation from template
export const useStartConversationFromTemplate = (templateId: number) => {
  const { useAddItem } = useApi<{ template_id: number }, Conversation>(`${START_CONVERSATION_URL}template/`);
  return useAddItem;
};
