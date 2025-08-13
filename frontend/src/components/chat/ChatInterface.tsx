'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import { Message, ChatInterfaceProps, CreateConversationRequest, SendMessageRequest } from '../../../types/chat'
import { useStartConversation, useConversationDetail, useSendMessage, useConversationList } from '@/services/chatService'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'
import { toast } from 'sonner'

export default function ChatInterface({ chatId, onTitleUpdate }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Add this hook to get refetch for the conversation list
  const { refetch: refetchConversationList } = useConversationList();
  // Determine if we should enable conversation detail query
  const shouldFetchConversation = Boolean(currentSessionId && !chatId.startsWith('new-'))

  // API hooks - always call them but conditionally enable
  const startConversationMutation = useStartConversation()
  const sendMessageMutation = useSendMessage(currentSessionId)
  
  // Always call useConversationDetail but enable it conditionally
  const { 
    data: conversationData, 
    isFetching: isLoadingConversation,
    error: conversationError,
    refetch: refetchConversation 
  } = useConversationDetail(currentSessionId, {
    enabled: shouldFetchConversation
  })

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Handle conversation loading errors
  useEffect(() => {
    if (conversationError && shouldFetchConversation) {
      console.error('Conversation loading error:', conversationError)
      toast.error('Failed to load conversation')
    }
  }, [conversationError, shouldFetchConversation])

  // Load messages when conversation data changes
  useEffect(() => {
    if (conversationData) {
      setMessages(conversationData.messages || [])
      if (onTitleUpdate && conversationData.title) {
        onTitleUpdate(conversationData.title)
      }
    }
  }, [conversationData])

  // Handle chat ID changes
  useEffect(() => {
    if (chatId.startsWith('new-')) {
      // New chat - reset everything
      setCurrentSessionId('')
      setMessages([{
        id: 0,
        conversation: 0,
        sender: 'bot',
        message_type: 'text',
        text: 'Hello! I\'m your CitizenNavigator assistant. I can help you with municipal services, incident reporting, or checking report status. How can I assist you today?',
        confidence: 1.0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
    } else if (chatId && chatId !== currentSessionId) {
      // Existing conversation
      setCurrentSessionId(chatId)
    }
  }, [chatId, currentSessionId])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    console.log('Sending message:', { text, chatId, currentSessionId })
    setIsLoading(true)

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now(),
      conversation: 0,
      sender: 'user',
      message_type: 'text',
      text: text.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      if (chatId.startsWith('new-') || !currentSessionId) {
        // Create new conversation
        console.log('Creating new conversation...')
        const createRequest: CreateConversationRequest = {
          language: 'en',
          initial_message: text.trim(),
          location_context: {}
        }
        const newConversation = await startConversationMutation.mutateAsync({ 
          item: createRequest 
        })
        console.log('New conversation created:', newConversation)
        await setCurrentSessionId(newConversation.session_id)
        if (refetchConversationList) {
          refetchConversationList();
        }
        // Append bot response to user's message
        if (newConversation.messages && newConversation.messages.length > 1) {
          // API returned both user and bot messages, append bot to current
          await setMessages(prev => [...prev, ...newConversation.messages.slice(1)])
        } else if (newConversation.messages && newConversation.messages.length === 1) {
          // Only user message, add default bot reply
          await setMessages(prev => [...prev, {
            id: Date.now() + 1,
            conversation: newConversation.id || 0,
            sender: 'bot',
            message_type: 'text',
            text: 'Thank you for your message. I\'m here to help you with municipal services. What specific assistance do you need?',
            confidence: 0.9,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
        }
        if (onTitleUpdate && newConversation.title) {
          onTitleUpdate(newConversation.title)
        }
      } else {
        // Send message to existing conversation
        console.log('Sending to existing conversation:', currentSessionId)
        const sendRequest = new FormData();
        sendRequest.append('text', text.trim());
        sendRequest.append('message_type', 'text');
        const response = await sendMessageMutation.mutateAsync({ 
          item: sendRequest
        })
        console.log('Message sent, response:', response)
        // Append bot response to user's message
        if (response.message) {
          await setMessages(prev => [...prev, response.message])
        }
        if (response.conversation?.title && onTitleUpdate) {
          await onTitleUpdate(response.conversation.title)
        }
        if (response.conversation?.resolution_type === 'incident_created') {
          toast.success('Incident report created successfully!')
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.slice(0, -1))
      const errorMessage: Message = {
        id: Date.now() + 2,
        conversation: 0,
        sender: 'bot',
        message_type: 'error',
        text: 'I apologize, but I\'m having trouble processing your request. Please try again or contact support if the issue persists.',
        confidence: 0.1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
      toast.error('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while fetching conversation
  if (isLoadingConversation && shouldFetchConversation) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading conversation...</h2>
            <p className="text-gray-600">Please wait while we load your chat history.</p>
          </div>
        </div>
      </div>
    )
  }

  const isFirstMessage = messages.length <= 1 || (messages.length === 1 && messages[0].sender === 'bot')

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4" role="main" aria-label="Chat messages">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
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
        
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 bg-white p-4 md:p-6" role="complementary" aria-label="Message input area">
        <ChatInput 
          onSendMessage={sendMessage} 
          disabled={isLoading} 
          isFirstMessage={isFirstMessage}
        />
      </div>
    </div>
  )
}