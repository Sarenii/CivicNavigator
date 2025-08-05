'use client'
import { useState } from 'react'
import { Citation } from './ChatInterface'
import { LinkIcon } from '@heroicons/react/24/outline'

interface InlineCitationProps {
  citation: Citation
  index: number
}

function InlineCitation({ citation, index }: InlineCitationProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <span className="relative">
      <sup
        className="text-blue-600 hover:text-blue-800 cursor-pointer bg-blue-50 hover:bg-blue-100 px-1 py-0.5 rounded text-xs font-medium mx-0.5 transition-colors"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={(e) => {
          e.stopPropagation()
          setShowTooltip(!showTooltip)
        }}
      >
        {index + 1}
      </sup>
      
      {showTooltip && (
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-80 max-w-sm z-50"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg p-4 shadow-xl border">
            <div className="font-medium mb-2 text-white">{citation.title}</div>
            {citation.snippet && (
              <div className="text-gray-300 mb-3 leading-relaxed">
                "{citation.snippet}"
              </div>
            )}
            {citation.source_link && (
              <a
                href={citation.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <LinkIcon className="w-3 h-3" />
                View full source
              </a>
            )}
            
            {/* Tooltip arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </span>
  )
}

interface CitationListProps {
  citations: Citation[]
}

export default function CitationList({ citations }: CitationListProps) {
  if (!citations || citations.length === 0) {
    return null
  }

  return (
    <span className="inline">
      {citations.map((citation, index) => (
        <InlineCitation key={index} citation={citation} index={index} />
      ))}
    </span>
  )
}