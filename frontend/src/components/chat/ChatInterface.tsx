'use client'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import MessageBubble from './MessageBubble'
import ChatInput from './ChatInput'
import TypingIndicator from './TypingIndicator'

export interface Citation {
  title: string
  snippet: string
  source_link?: string
}

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  citations?: Citation[]
  confidence?: number
  isTyping?: boolean
}

interface ChatInterfaceProps {
  chatId: string
  onTitleUpdate?: (title: string) => void
}

export default function ChatInterface({ chatId, onTitleUpdate }: ChatInterfaceProps) {
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your CivicNavigator assistant. I can help you find information about municipal services, report incidents, or check the status of existing reports. What would you like to know?',
      sender: 'bot',
      timestamp: new Date(),
      confidence: 1.0
    }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      // Development mode - simulate AI response
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Generate contextual mock response based on user input
        const generateMockResponse = (userText: string) => {
          const lowerText = userText.toLowerCase()
          
          if (lowerText.includes('waste') || lowerText.includes('garbage') || lowerText.includes('trash')) {
            return {
              text: "Waste collection in Nairobi happens twice a week for most residential areas. Collection days vary by ward - typically Monday/Thursday or Tuesday/Friday. You should place bins outside by 6 AM on collection days. For South C specifically, waste is collected on Tuesdays and Fridays.",
              citations: [
                {
                  title: 'Nairobi City County Waste Management Guidelines 2024',
                  snippet: 'Residential waste collection occurs twice weekly with specific schedules for each ward...',
                  source_link: '#'
                },
                {
                  title: 'South C Ward Service Schedule',
                  snippet: 'Collection days: Tuesday and Friday, bins should be placed by 6:00 AM...'
                }
              ],
              confidence: 0.92
            }
          }
          
          if (lowerText.includes('streetlight') || lowerText.includes('lighting') || lowerText.includes('light')) {
            return {
              text: "For streetlight issues, you can report them through our incident system or call the County maintenance hotline at 0800-NAIROBI. Most streetlight repairs are completed within 5-7 business days. Please provide the specific location or nearest landmark when reporting.",
              citations: [
                {
                  title: 'Infrastructure Maintenance Procedures',
                  snippet: 'Streetlight repairs prioritized based on safety concerns, typical resolution 5-7 days...',
                  source_link: '#'
                }
              ],
              confidence: 0.88
            }
          }
          
          if (lowerText.includes('permit') || lowerText.includes('license') || lowerText.includes('business')) {
            return {
              text: "Business permits can be applied for online through the County portal or at City Hall. Required documents include ID, business registration certificate, and location clearance. Processing time is typically 14-21 days. Fees range from KES 2,000-15,000 depending on business type.",
              citations: [
                {
                  title: 'Business Licensing Guide 2024',
                  snippet: 'Complete guide to obtaining business permits including required documents and fees...',
                  source_link: '#'
                },
                {
                  title: 'Online Application Portal Instructions',
                  snippet: 'Step-by-step process for submitting business permit applications online...'
                }
              ],
              confidence: 0.85
            }
          }
          
          if (lowerText.includes('water') || lowerText.includes('sewerage') || lowerText.includes('plumbing')) {
            return {
              text: "Water and sewerage services are managed by Nairobi City Water & Sewerage Company. For service interruptions, call their 24/7 hotline at 0800-WATER. Planned maintenance is usually announced 48 hours in advance. Bills can be paid online, via M-Pesa, or at designated outlets.",
              citations: [
                {
                  title: 'Water & Sewerage Service Directory',
                  snippet: '24/7 customer service, online billing, maintenance schedules and contact information...',
                  source_link: '#'
                }
              ],
              confidence: 0.90
            }
          }
          
          // Default response for unmatched queries
          return {
            text: "I can help you with information about municipal services including waste collection, streetlights, business permits, water services, and more. I can also assist you with reporting incidents or checking the status of existing reports. Could you please be more specific about what you'd like to know?",
            citations: [
              {
                title: 'Municipal Services Overview',
                snippet: 'Comprehensive guide to all available municipal services and contact information...',
                source_link: '#'
              }
            ],
            confidence: 0.60
          }
        }
        
        const responseData = generateMockResponse(text)
        
        // Mock AI response with actual helpful content
        const mockResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: responseData.text,
          sender: 'bot',
          timestamp: new Date(),
          citations: responseData.citations,
          confidence: responseData.confidence
        }

        setMessages(prev => [...prev, mockResponse])
        setIsLoading(false)
        return
      }

      // Production API call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}` // Assuming JWT token
        },
        body: JSON.stringify({
          message: text,
          conversation_id: 'current-session', // TODO: Implement proper session management
          user_id: user?.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.reply,
          sender: 'bot',
          timestamp: new Date(),
          citations: data.citations,
          confidence: data.confidence
        }

        setMessages(prev => [...prev, botMessage])
      } else {
        // Error handling
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: 'I apologize, but I\'m having trouble processing your request right now. Please try again or contact support if the issue persists.',
          sender: 'bot',
          timestamp: new Date(),
          confidence: 0.1
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      // Network error handling
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I\'m experiencing connection issues. Please check your internet connection and try again.',
        sender: 'bot',
        timestamp: new Date(),
        confidence: 0.1
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 1 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to CivicNavigator</h2>
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
      <div className="border-t border-gray-200 bg-white p-6">
        <ChatInput 
          onSendMessage={sendMessage} 
          disabled={isLoading} 
          isFirstMessage={messages.length <= 1}
        />
      </div>
    </div>
  )
}