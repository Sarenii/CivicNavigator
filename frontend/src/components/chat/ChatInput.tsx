'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  PaperAirplaneIcon, 
  MicrophoneIcon,
  PhotoIcon,
  DocumentIcon
} from '@heroicons/react/24/outline'

interface ChatInputProps {
  onSendMessage: (message: string) => void
  disabled?: boolean
  isFirstMessage?: boolean
}

export default function ChatInput({ onSendMessage, disabled = false, isFirstMessage = false }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
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

  const handleVoiceInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Voice input is not supported in your browser')
      return
    }

    try {
      setIsRecording(true)
      // Voice recording implementation would go here
      // For now, just simulate
      setTimeout(() => {
        setIsRecording(false)
      }, 2000)
    } catch (error) {
      setIsRecording(false)
      alert('Unable to access microphone')
    }
  }

  const handleFileUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*,.pdf,.doc,.docx,.txt'
    input.setAttribute('aria-label', 'Upload file')
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setMessage(prev => prev + `[File: ${file.name}] `)
      }
    }
    input.click()
  }

  const getPlaceholder = () => {
    if (isFirstMessage) {
      return "Ask about municipal services, report an issue, or check status..."
    }
    return "Type your message..."
  }

  const quickSuggestions = [
    "How do I report a streetlight issue?",
    "What are the waste collection schedules?", 
    "How do I apply for a business permit?",
    "Check my incident report status"
  ]

  return (
    <div className="space-y-4">
      {/* Quick Start Suggestions */}
      {isFirstMessage && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700 font-medium">Quick Start:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="Quick start suggestions">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSendMessage(suggestion)}
                disabled={disabled}
                className="p-3 text-sm bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg border border-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-left hover:shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                aria-label={`Quick suggestion: ${suggestion}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative" role="search" aria-label="Chat message form">
        <div className="flex items-end gap-2 p-3 bg-white rounded-2xl border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-400 transition-all duration-200">
          
          {/* File Upload Button */}
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
            title="Attach file"
            aria-label="Attach file"
          >
            <DocumentIcon className="w-5 h-5" />
          </button>

          {/* Photo Button */}
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={disabled}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none"
            title="Attach photo"
            aria-label="Attach photo"
          >
            <PhotoIcon className="w-5 h-5" />
          </button>

          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <label htmlFor="message-input" className="sr-only">
              {getPlaceholder()}
            </label>
            <textarea
              id="message-input"
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              disabled={disabled}
              rows={1}
              className="w-full resize-none border-none outline-none bg-transparent text-gray-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-0"
              style={{ minHeight: '24px', maxHeight: '120px' }}
              aria-label="Message input"
            />
          </div>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={disabled}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 focus:outline-none ${
              isRecording 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
            }`}
            title={isRecording ? 'Recording...' : 'Voice input'}
            aria-label={isRecording ? 'Recording voice input' : 'Start voice input'}
            aria-pressed={isRecording}
          >
            <MicrophoneIcon className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="flex-shrink-0 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-105 disabled:transform-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
            title="Send message"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Recording Indicator */}
        {isRecording && (
          <div className="absolute -top-12 left-0 right-0 flex items-center justify-center" role="status" aria-live="polite">
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg shadow-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" aria-hidden="true"></div>
              <span className="text-sm text-red-700 font-medium">Recording...</span>
            </div>
          </div>
        )}
      </form>

      {/* Help Text */}
      {isFirstMessage && (
        <div className="text-center">
          <p className="text-xs text-gray-600">
            💡 <strong>Tip:</strong> Ask about municipal services, report issues, or check your report status
          </p>
        </div>
      )}

      {/* Processing Indicator */}
      {disabled && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-pulse" role="status" aria-live="polite">
          <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" aria-hidden="true"></div>
          <span className="text-sm text-blue-700">Processing your message...</span>
        </div>
      )}
    </div>
  )
}