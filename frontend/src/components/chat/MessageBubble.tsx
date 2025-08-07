'use client'

import { MessageBubbleProps } from '../../../types'
import CitationList from './CitationList'
import { UserIcon, CpuChipIcon } from '@heroicons/react/24/outline'

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user'
  const isBot = message.sender === 'bot'

  // Confidence indicator color
  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500'
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Unknown'
    if (confidence >= 0.8) return 'High confidence'
    if (confidence >= 0.6) return 'Medium confidence'
    return 'Low confidence'
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2 md:gap-3 max-w-[85%] md:max-w-[80%]`}>
        {/* Avatar - Responsive */}
        <div className={`flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600' : 'bg-gray-600'
        }`}>
          {isUser ? (
            <UserIcon className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
          ) : (
            <CpuChipIcon className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" />
          )}
        </div>

        {/* Message Content - Responsive */}
        <div className={`rounded-2xl px-3 md:px-4 py-2 md:py-3 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200' 
            : 'bg-white text-gray-900 border border-gray-200 shadow-gray-100'
        }`}>
          {/* Message Text with Inline Citations */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
            {/* Inline citations appear right after the text */}
            {isBot && message.citations && message.citations.length > 0 && (
              <CitationList citations={message.citations} />
            )}
          </div>

          {/* Bot-specific elements */}
          {isBot && (
            <div className="mt-3 space-y-2">
              {/* Confidence Indicator */}
              {message.confidence !== undefined && (
                <div className={`text-xs ${getConfidenceColor(message.confidence)} mt-2`}>
                  {getConfidenceText(message.confidence)} ({Math.round(message.confidence * 100)}%)
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isUser ? 'text-blue-200' : 'text-gray-500'
          }`}>
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
    </div>
  )
}