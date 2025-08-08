'use client'

import { useState } from 'react'
import { MessageBubbleProps } from '../../../types/chat'
import { MessageUtils, FeedbackUtils } from '@/services/chatUtils'
import CitationList from './CitationList'
import MarkdownRenderer from './MarkdownRenderer'
import {
  UserIcon,
  CpuChipIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon,
  EllipsisHorizontalIcon,
  ClockIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const isUser = message.sender === 'user'
  const isBot = message.sender === 'bot'
  const isSystem = message.sender === 'system'

  // Get timestamp using utility
  const getTimestamp = () => {
    try {
      return MessageUtils.formatTimestamp(message.created_at)
    } catch {
      return new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  // Get confidence color using utility
  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500'
    return MessageUtils.getConfidenceColor(confidence)
  }

  // Get confidence text using utility
  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Unknown confidence'
    return MessageUtils.getConfidenceText(confidence)
  }

  // Get message type icon
  const getMessageTypeIcon = () => {
    switch (message.message_type) {
      case 'clarification':
        return <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
      case 'error':
        return <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />
      case 'system_info':
        return <SparklesIcon className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  // Handle feedback submission
  const handleFeedback = async (isPositive: boolean) => {
    try {
      await FeedbackUtils.submitMessageFeedback(message.conversation.toString(), message.id, isPositive)
      setFeedbackSubmitted(true)
      setShowFeedback(false)
    } catch (error) {
      console.error('Failed to submit feedback:', error)
    }
  }

  // Handle message actions
  const handleMessageAction = (action: 'copy' | 'share' | 'report') => {
    switch (action) {
      case 'copy':
        navigator.clipboard.writeText(message.text)
        break
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: 'Chat Message',
            text: message.text,
            url: window.location.href
          })
        } else {
          navigator.clipboard.writeText(message.text)
        }
        break
      case 'report':
        // Handle report functionality
        console.log('Report message:', message.id)
        break
    }
    setShowMenu(false)
  }

  // Get intent display text
  const getIntentDisplay = () => {
    if (!message.intent) return null
    
    const intentMap: Record<string, string> = {
      'question': 'Question',
      'incident_report': 'Incident Report',
      'status_check': 'Status Check',
      'service_info': 'Service Information',
      'complaint': 'Complaint',
      'general': 'General Inquiry'
    }
    
    return intentMap[message.intent] || message.intent
  }

  // Get processing time display
  const getProcessingTimeDisplay = () => {
    if (!message.processing_time) return null
    
    const seconds = Math.round(message.processing_time * 100) / 100
    return `${seconds}s`
  }

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25' 
          : isSystem
          ? 'bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/25'
          : 'bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg shadow-gray-500/25'
      }`}>
        {isUser ? (
          <UserIcon className="w-4 h-4 text-white" />
        ) : isSystem ? (
          <SparklesIcon className="w-4 h-4 text-white" />
        ) : (
          <CpuChipIcon className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'order-first' : ''}`}>
        <div className={`rounded-2xl px-4 py-3 shadow-sm ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
            : isSystem
            ? 'bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 text-purple-800'
            : 'bg-white border border-gray-200 text-gray-900'
        }`}>
          {/* Message Type Icon */}
          {getMessageTypeIcon() && (
            <div className="flex items-center gap-2 mb-2">
              {getMessageTypeIcon()}
              <span className="text-xs font-medium">
                {message.message_type === 'clarification' && 'Clarification Needed'}
                {message.message_type === 'error' && 'Error'}
                {message.message_type === 'system_info' && 'System Information'}
              </span>
            </div>
          )}

          {/* Message Text */}
          <div className="text-sm leading-relaxed">
            <MarkdownRenderer content={message.text} />
          </div>

          {/* Message Metadata */}
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-200/20">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>{getTimestamp()}</span>
              
              {/* Intent */}
              {getIntentDisplay() && (
                <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                  {getIntentDisplay()}
                </span>
              )}
              
              {/* Processing Time */}
              {getProcessingTimeDisplay() && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="w-3 h-3" />
                  <span>{getProcessingTimeDisplay()}</span>
                </div>
              )}
              
              {/* AI Model Version */}
              {message.ai_model_version && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  {message.ai_model_version}
                </span>
              )}
            </div>

            {/* Confidence Score (for bot messages) */}
            {isBot && message.confidence !== undefined && (
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${getConfidenceColor(message.confidence)}`}>
                  {getConfidenceText(message.confidence)}
                </span>
              </div>
            )}
          </div>

          {/* Message Actions */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              {/* Copy Button */}
              <button
                onClick={() => handleMessageAction('copy')}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Copy message"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Share Button */}
              <button
                onClick={() => handleMessageAction('share')}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                title="Share message"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </button>

              {/* Report Button */}
              <button
                onClick={() => handleMessageAction('report')}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                title="Report message"
              >
                <FlagIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Feedback for Bot Messages */}
            {isBot && !feedbackSubmitted && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFeedback(true)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors duration-200"
                  title="Mark as helpful"
                >
                  <HandThumbUpIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                  title="Mark as unhelpful"
                >
                  <HandThumbDownIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Feedback Submitted Indicator */}
            {isBot && feedbackSubmitted && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircleIcon className="w-3.5 h-3.5" />
                <span className="text-xs">Feedback submitted</span>
              </div>
            )}
          </div>
        </div>

        {/* Citations for Bot Messages */}
        {isBot && message.citations && message.citations.length > 0 && (
          <CitationList citations={message.citations} />
        )}

        {/* Clarification Needed */}
        {message.clarification_needed && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ExclamationTriangleIcon className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">Clarification Needed</span>
            </div>
            <p className="text-sm text-amber-700">
              {message.clarification_type === 'location' && 'Please provide more specific location details.'}
              {message.clarification_type === 'incident_type' && 'Please specify the type of incident you\'re reporting.'}
              {message.clarification_type === 'contact_info' && 'Please provide your contact information.'}
              {message.clarification_type === 'general' && 'Please provide more details to help me assist you better.'}
            </p>
          </div>
        )}

        {/* Entities Display */}
        {message.entities && Object.keys(message.entities).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(message.entities).map(([key, value]) => (
              <span key={key} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                {key}: {value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}