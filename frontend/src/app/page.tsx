import Link from 'next/link'
import { ChatBubbleLeftRightIcon, ExclamationTriangleIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-4">
          CivicNavigator
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Your AI-powered assistant for municipal services. Get answers, report issues, and track incident status.
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link 
          href="/chat" 
          className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
          aria-label="Start chatting with the AI assistant"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Ask Questions
          </h2>
          <p className="text-gray-600">
            Get instant answers about municipal services with reliable citations from our knowledge base.
          </p>
        </Link>
        
        <Link 
          href="/report" 
          className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-green-200"
          aria-label="Report a municipal incident"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
            <ExclamationTriangleIcon className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-green-700 mb-2">
            Report Issue
          </h2>
          <p className="text-gray-600">
            Submit incident reports for streetlights, waste collection, road issues, and more.
          </p>
        </Link>
        
        <Link 
          href="/status" 
          className="group bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-orange-200"
          aria-label="Check incident status"
        >
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4 group-hover:bg-orange-200 transition-colors">
            <ClipboardDocumentCheckIcon className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-xl font-semibold text-orange-700 mb-2">
            Check Status
          </h2>
          <p className="text-gray-600">
            Track the progress of your submitted incident reports with reference IDs.
          </p>
        </Link>
      </div>

      {/* Quick Stats or Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-900">24/7</div>
            <div className="text-sm text-gray-600">Available</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">Instant</div>
            <div className="text-sm text-gray-600">Responses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">Cited</div>
            <div className="text-sm text-gray-600">Sources</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">Tracked</div>
            <div className="text-sm text-gray-600">Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}