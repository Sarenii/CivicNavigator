'use client'

import { useState } from 'react'
import { CitationListProps } from '../../../types/chat'
import { CitationUtils } from '@/services/chatUtils'
import { 
  DocumentTextIcon, 
  ArrowTopRightOnSquareIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  BookmarkIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

export default function CitationList({ citations }: CitationListProps) {
  const [expandedCitations, setExpandedCitations] = useState<Set<number>>(new Set())
  const [showAllCitations, setShowAllCitations] = useState(false)

  if (!citations || citations.length === 0) {
    return null
  }

  const toggleCitation = (index: number) => {
    const newExpanded = new Set(expandedCitations)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedCitations(newExpanded)
  }

  const handleCitationClick = (citation: any, index: number) => {
    if (citation.source_link && citation.source_link !== '#') {
      window.open(citation.source_link, '_blank', 'noopener,noreferrer')
    } else {
      toggleCitation(index)
    }
  }

  const handleShareCitation = (citation: any) => {
    if (navigator.share) {
      navigator.share({
        title: citation.title,
        text: citation.snippet,
        url: citation.source_link || window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      const textToCopy = `${citation.title}\n\n${citation.snippet}\n\nSource: ${citation.source_link || 'N/A'}`
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // You could add a toast notification here
          console.log('Citation copied to clipboard')
        })
        .catch(err => {
          console.error('Failed to copy citation:', err)
        })
    }
  }

  const handleBookmarkCitation = (citation: any) => {
    // Save to localStorage for now, could be enhanced with backend integration
    const bookmarks = JSON.parse(localStorage.getItem('citation_bookmarks') || '[]')
    const newBookmark = {
      ...citation,
      bookmarkedAt: new Date().toISOString()
    }
    
    const isAlreadyBookmarked = bookmarks.some((bookmark: any) => 
      bookmark.title === citation.title && bookmark.source_link === citation.source_link
    )
    
    if (!isAlreadyBookmarked) {
      bookmarks.push(newBookmark)
      localStorage.setItem('citation_bookmarks', JSON.stringify(bookmarks))
      // You could add a toast notification here
      console.log('Citation bookmarked')
    }
  }

  const displayedCitations = showAllCitations ? citations : citations.slice(0, 3)
  const hasMoreCitations = citations.length > 3

  return (
    <div className="mt-4 space-y-3">
      {/* Citations Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DocumentTextIcon className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">
            Sources & References ({citations.length})
          </span>
        </div>
        {hasMoreCitations && (
          <button
            onClick={() => setShowAllCitations(!showAllCitations)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            {showAllCitations ? 'Show Less' : `Show ${citations.length - 3} More`}
            {showAllCitations ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
          </button>
        )}
      </div>

      {/* Citations List */}
      <div className="space-y-2">
        {displayedCitations.map((citation, index) => {
          const isExpanded = expandedCitations.has(index)
          const isValidCitation = CitationUtils.validateCitation(citation)
          
          return (
            <div
              key={index}
              className={`bg-gray-50 border border-gray-200 rounded-lg p-3 transition-all duration-200 hover:shadow-sm ${
                isExpanded ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              {/* Citation Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate">
                    {citation.title}
                  </h4>
                  {citation.source_link && citation.source_link !== '#' && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {citation.source_link}
                    </p>
                  )}
                </div>
                
                {/* Citation Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleBookmarkCitation(citation)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Bookmark citation"
                  >
                    <BookmarkIcon className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    onClick={() => handleShareCitation(citation)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                    title="Share citation"
                  >
                    <ShareIcon className="w-3.5 h-3.5" />
                  </button>
                  
                  {citation.source_link && citation.source_link !== '#' && (
                    <button
                      onClick={() => handleCitationClick(citation, index)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                      title="Open source"
                    >
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Citation Content */}
              <div className="mt-2">
                <p className={`text-sm text-gray-700 leading-relaxed ${
                  isExpanded ? '' : 'line-clamp-2'
                }`}>
                  {citation.snippet}
                </p>
                
                {/* Expand/Collapse Button */}
                {citation.snippet.length > 150 && (
                  <button
                    onClick={() => toggleCitation(index)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 flex items-center gap-1"
                  >
                    {isExpanded ? 'Show Less' : 'Read More'}
                    {isExpanded ? (
                      <ChevronUpIcon className="w-3 h-3" />
                    ) : (
                      <ChevronDownIcon className="w-3 h-3" />
                    )}
                  </button>
                )}
              </div>

              {/* Citation Metadata */}
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>
                    {isValidCitation ? '✓ Valid source' : '⚠ Incomplete source'}
                  </span>
                  <span>
                    Source {index + 1} of {citations.length}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Citations Summary */}
      {citations.length > 1 && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800">
            <strong>Summary:</strong> This response is based on {citations.length} sources. 
            Click on any citation to view the full source or expand for more details.
          </p>
        </div>
      )}
    </div>
  )
}