import Link from 'next/link'
import { ChatBubbleLeftRightIcon, ExclamationTriangleIcon, ClipboardDocumentCheckIcon, SparklesIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section - Enhanced */}
      <div className="text-center mb-16 py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl">
          <SparklesIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 bg-clip-text text-transparent mb-6">
          CivicNavigator
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Your AI-powered assistant for municipal services. Get answers, report issues, and track incident status—all in one place.
        </p>
      </div>

      {/* Main Features Grid - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Link 
          href="/chat" 
          className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 overflow-hidden"
          aria-label="Start chatting with the AI assistant"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-blue-900 mb-3">
              Ask Questions
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Get instant answers about municipal services with reliable citations from our comprehensive knowledge base.
            </p>
          </div>
        </Link>
        
        <Link 
          href="/report" 
          className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200 transform hover:-translate-y-2 overflow-hidden"
          aria-label="Report a municipal incident"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ExclamationTriangleIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-red-700 mb-3">
              Report Issue
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Submit detailed incident reports for streetlights, waste collection, road issues, and infrastructure problems.
            </p>
          </div>
        </Link>
        
        <Link 
          href="/status" 
          className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 transform hover:-translate-y-2 overflow-hidden"
          aria-label="Check incident status"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <ClipboardDocumentCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-orange-700 mb-3">
              Check Status
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Track the real-time progress of your submitted incident reports using reference IDs.
            </p>
          </div>
        </Link>
      </div>

      {/* Enhanced Stats Section */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 text-center mb-8">Why Choose CivicNavigator?</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="group">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              24/7
            </div>
            <div className="text-sm font-medium text-gray-700">Always Available</div>
            <div className="text-xs text-gray-500 mt-1">Round-the-clock service</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              Instant
            </div>
            <div className="text-sm font-medium text-gray-700">Quick Responses</div>
            <div className="text-xs text-gray-500 mt-1">AI-powered answers</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              Cited
            </div>
            <div className="text-sm font-medium text-gray-700">Reliable Sources</div>
            <div className="text-xs text-gray-500 mt-1">Verified information</div>
          </div>
          <div className="group">
            <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
              Tracked
            </div>
            <div className="text-sm font-medium text-gray-700">Full Progress</div>
            <div className="text-xs text-gray-500 mt-1">Real-time updates</div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16">
        <Link
          href="/chat"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5" />
          Get Started Now
        </Link>
      </div>
    </div>
  )
}