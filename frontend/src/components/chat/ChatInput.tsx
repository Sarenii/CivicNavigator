'use client'

import { useState, useRef } from 'react'
import { PaperAirplaneIcon, MicrophoneIcon } from '@heroicons/react/24/outline'
import { ChatInputProps } from '../../../types'

export default function ChatInput({ onSendMessage, disabled = false, isFirstMessage = false }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || disabled) return
    
    onSendMessage(input)
    setInput('')
    
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    
    // Auto-resize textarea
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  // Placeholder voice input (not implemented)
  const handleVoiceInput = () => {
    setIsListening(!isListening)
    // TODO: Implement speech recognition
    alert('Voice input coming soon!')
  }

  // Quick suggestion buttons
  const quickSuggestions = [
    "What are the waste collection days?",
    "How do I get a business permit?",
    "Report a streetlight issue",
    "Check water service status"
  ]

  return (
    <div className="space-y-3">
      {/* Quick Suggestions */}
      {isFirstMessage && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 mr-2">Try asking:</span>
          {quickSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInput(suggestion)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors"
              disabled={disabled}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-3 items-end">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask about municipal services, report an issue, or check status..."
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:text-gray-500 shadow-sm hover:shadow-md transition-shadow"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            aria-label="Type your message"
          />
          
          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={disabled}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all ${
              isListening 
                ? 'text-red-600 bg-red-50 hover:bg-red-100 scale-110' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            <MicrophoneIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none transform hover:scale-105 disabled:scale-100"
          aria-label="Send message"
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </form>

      {/* Help Text */}
      <div className="text-xs text-gray-500 text-center">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  )
}