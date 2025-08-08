'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatInputProps } from '../../../types/chat'
import { 
  PaperAirplaneIcon, 
  MicrophoneIcon,
  PhotoIcon,
  DocumentIcon,
  MapPinIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export default function ChatInput({ onSendMessage, disabled = false, isFirstMessage = false }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  // Focus textarea on mount for new conversations
  useEffect(() => {
    if (isFirstMessage && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isFirstMessage])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || disabled) return

    onSendMessage(message.trim())
    setMessage('')
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleVoiceInput = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Voice input is not supported in your browser')
      return
    }

    setIsRecording(true)
    // Voice recording implementation would go here
    // For now, just simulate
    setTimeout(() => {
      setIsRecording(false)
      setMessage('Voice input would be processed here')
    }, 2000)
  }

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf,.doc,.docx'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // File upload implementation would go here
        setMessage(`[File: ${file.name}]`)
      }
    }
    input.click()
  }

  const handleLocationShare = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMessage(`My location: ${latitude}, ${longitude}`)
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location')
        }
      )
    } else {
      alert('Geolocation is not supported in your browser')
    }
  }

  const getPlaceholder = () => {
    if (isFirstMessage) {
      return "Ask me about municipal services, report an issue, or check incident status..."
    }
    return "Type your message..."
  }

  const getSuggestions = () => {
    if (isFirstMessage) {
      return [
        "How do I report a streetlight issue?",
        "What are the waste collection schedules?",
        "How do I apply for a business permit?",
        "Check my incident report status"
      ]
    }
    return []
  }

  return (
    <div className="space-y-4">
      {/* First Message Suggestions */}
      {isFirstMessage && getSuggestions().length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600 font-medium">Quick Start:</p>
          <div className="flex flex-wrap gap-2">
            {getSuggestions().map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion)}
                disabled={disabled}
                className="px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-400 transition-all duration-200">
          {/* Attachment Button */}
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach file"
          >
            <DocumentIcon className="w-5 h-5" />
          </button>

          {/* Photo Button */}
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Attach photo"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>

          {/* Location Button */}
          <button
            type="button"
            onClick={handleLocationShare}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Share location"
          >
            <MapPinIcon className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              disabled={disabled}
              rows={1}
              className="w-full resize-none border-none outline-none bg-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '24px', maxHeight: '120px' }}
            />
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={disabled || isRecording}
            className={`flex-shrink-0 p-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecording 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={isRecording ? 'Recording...' : 'Voice input'}
          >
            <MicrophoneIcon className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="flex-shrink-0 p-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none"
            title="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-red-700 font-medium">Recording...</span>
            </div>
          </div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-sm text-blue-700 font-medium">Typing...</span>
            </div>
          </div>
        )}
      </form>

      {/* Help Text */}
      {isFirstMessage && (
        <div className="text-center">
          <p className="text-xs text-gray-500">
            💡 <strong>Tip:</strong> You can ask me about municipal services, report issues, or check the status of your reports.
          </p>
        </div>
      )}

      {/* Error State */}
      {disabled && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
          <span className="text-sm text-red-700">
            Unable to send message. Please try again.
          </span>
        </div>
      )}
    </div>
  )
}