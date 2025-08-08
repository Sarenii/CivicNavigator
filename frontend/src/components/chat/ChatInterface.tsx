'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { Message, ChatInterfaceProps, CreateConversationRequest, SendMessageRequest } from '../../../types/chat'
import { useStartConversation, useConversationDetail, useSendMessage } from '@/services/chatService'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import { toast } from 'sonner'

export default function ChatInterface({ chatId, onTitleUpdate }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [conversationState, setConversationState] = useState<any>(null)
  const [suggestedActions, setSuggestedActions] = useState<string[]>([])
  const [optimisticMessageId, setOptimisticMessageId] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // API hooks
  const startConversationMutation = useStartConversation()
  const sendMessageMutation = useSendMessage(currentSessionId)
  
  // Fetch conversation details if we have a session ID
  const { 
    data: conversationData, 
    isLoading: isLoadingConversation, 
    error: conversationError,
    refetch: refetchConversation 
  } = useConversationDetail(currentSessionId)

  // Handle conversation loading errors
  useEffect(() => {
    if (conversationError) {
      toast.error('Failed to load conversation', {
        description: 'Please try refreshing the page.'
      })
    }
  }, [conversationError])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Load messages when conversation data changes
  useEffect(() => {
    if (conversationData) {
      setMessages(conversationData.messages || [])
      setConversationState(conversationData.state)
      
      if (onTitleUpdate && conversationData.title) {
        onTitleUpdate(conversationData.title)
      }
    }
  }, [conversationData, onTitleUpdate])

  // Handle new chat creation
  useEffect(() => {
    if (chatId.startsWith('new-') && !currentSessionId) {
      // This is a new chat, we'll create it when user sends first message
      setMessages([{
        id: 0,
        conversation: 0,
        sender: 'bot',
        message_type: 'text',
        text: 'Hello! I\'m your CitizenNavigator assistant. I can help you find information about municipal services, report incidents, or check the status of existing reports. What would you like to know?',
        confidence: 1.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    } else if (!chatId.startsWith('new-') && chatId !== currentSessionId) {
      // This is an existing conversation
      setCurrentSessionId(chatId)
    }
  }, [chatId, currentSessionId])

  // Handle suggested actions from AI responses
  const handleSuggestedAction = useCallback((action: string) => {
    if (action.includes('📞') || action.includes('Contact')) {
      // Handle contact actions
      toast.info('Contact information provided', {
        description: 'Please use the provided contact details.'
      })
    } else if (action.includes('📋') || action.includes('Report')) {
      // Handle incident reporting
      toast.info('Incident reporting initiated', {
        description: 'I\'ll help you create an incident report.'
      })
    } else if (action.includes('🔍') || action.includes('Check')) {
      // Handle status checking
      toast.info('Status checking initiated', {
        description: 'I\'ll help you check the status of your reports.'
      })
    }
  }, [])

  // Function to add message to state with proper error handling
  const addMessageToState = useCallback((message: Message) => {
    setMessages(prev => {
      // Check if message already exists to prevent duplicates
      const exists = prev.some(m => m.id === message.id)
      if (exists) {
        return prev
      }
      return [...prev, message]
    })
  }, [])

  // Function to update message in state
  const updateMessageInState = useCallback((messageId: number, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    )
  }, [])

  // Function to remove optimistic message on error
  const removeOptimisticMessage = useCallback(() => {
    if (optimisticMessageId) {
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessageId))
      setOptimisticMessageId(null)
    }
  }, [optimisticMessageId])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    console.log('Sending message:', text)
    console.log('Current session ID:', currentSessionId)
    console.log('Chat ID:', chatId)

    // Create optimistic user message
    const optimisticUserMessage: Message = {
      id: Date.now(),
      conversation: conversationData?.id || 0,
      sender: 'user',
      message_type: 'text',
      text: text.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Add user message to UI immediately (optimistic update)
    addMessageToState(optimisticUserMessage)
    setOptimisticMessageId(optimisticUserMessage.id)
    setIsLoading(true)

    try {
      // If this is a new chat, create conversation first
      if (chatId.startsWith('new-')) {
        console.log('Creating new conversation...')
        const createRequest: CreateConversationRequest = {
          language: 'en',
          initial_message: text.trim(),
          location_context: {}
        }

        console.log('Create request:', createRequest)

        const newConversation = await startConversationMutation.mutateAsync({ 
          item: createRequest 
        })
        
        console.log('New conversation created:', newConversation)
        
        setCurrentSessionId(newConversation.session_id)
        
        // Replace optimistic message with actual conversation data
        if (newConversation.messages) {
          setMessages(newConversation.messages)
        }
        
        if (onTitleUpdate && newConversation.title) {
          onTitleUpdate(newConversation.title)
        }

        // Handle suggested actions from new conversation
        if (newConversation.state?.state_data?.suggested_actions) {
          setSuggestedActions(newConversation.state.state_data.suggested_actions)
        }
        
        setIsLoading(false)
        setOptimisticMessageId(null)
        return
      }

      // Send message to existing conversation
      if (currentSessionId) {
        console.log('Sending message to existing conversation:', currentSessionId)
        const sendRequest: SendMessageRequest = {
          text: text.trim(),
          message_type: 'text'
        }

        console.log('Send request:', sendRequest)

        const response = await sendMessageMutation.mutateAsync({ 
          item: sendRequest as any
        })
        
        console.log('Send response:', response)
        
        // Remove optimistic message and add the actual response
        removeOptimisticMessage()
        
        // Add the AI response to messages
        if (response.message) {
          addMessageToState(response.message)
        }
        
        // Update conversation title if provided
        if (response.conversation?.title && onTitleUpdate) {
          onTitleUpdate(response.conversation.title)
        }

        // Handle suggested actions
        if (response.suggested_actions && response.suggested_actions.length > 0) {
          setSuggestedActions(response.suggested_actions)
        }

        // Handle incident creation if mentioned
        if (response.conversation?.resolution_type === 'incident_created') {
          toast.success('Incident report created successfully!', {
            description: 'Your incident has been logged and will be processed.'
          })
        }

        // Handle conversation state changes
        if (response.conversation?.state) {
          setConversationState(response.conversation.state)
        }

        // Refetch conversation data to ensure consistency
        await refetchConversation()
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      
      // Remove optimistic message on error
      removeOptimisticMessage()
      
      // Show error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        conversation: conversationData?.id || 0,
        sender: 'bot',
        message_type: 'error',
        text: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact support if the issue persists.',
        confidence: 0.1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      addMessageToState(errorMessage)
      
      toast.error('Failed to send message', {
        description: 'Please try again in a moment.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while fetching conversation
  if (isLoadingConversation && currentSessionId) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading conversation...</h2>
            <p className="text-gray-600">Please wait while we load your chat history.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !isLoadingConversation && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to CitizenNavigator</h2>
            <p className="text-gray-600 max-w-md mx-auto">Ask me anything about municipal services, report issues, or check incident status.</p>
          </div>
        )}
        
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isLoading && <TypingIndicator />}
        
        {/* Suggested Actions */}
        {suggestedActions.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Suggested Actions:</h3>
            <div className="flex flex-wrap gap-2">
              {suggestedActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedAction(action)}
                  className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-full transition-colors duration-200"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Conversation State Information */}
        {conversationState && conversationState.current_state !== 'completed' && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <strong>Status:</strong> {conversationState.expected_input || 'Processing your request...'}
            </p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 bg-white p-6">
        <ChatInput 
          onSendMessage={sendMessage} 
          disabled={isLoading || isLoadingConversation} 
          isFirstMessage={messages.length <= 1}
        />
      </div>
    </div>
  )
}