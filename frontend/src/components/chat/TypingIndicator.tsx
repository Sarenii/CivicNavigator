'use client'
import { CpuChipIcon } from '@heroicons/react/24/outline'

export default function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start gap-3 max-w-[80%]">
        {/* Bot Avatar */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
          <CpuChipIcon className="w-5 h-5 text-white" />
        </div>

        {/* Typing Animation */}
        <div className="bg-gray-100 rounded-lg px-4 py-3 border border-gray-200">
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">CivicNavigator is typing</span>
            <div className="flex gap-1 ml-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}