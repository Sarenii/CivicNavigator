'use client'

import { useState, useEffect } from 'react'
import { useChatAnalytics, useConversationStats } from '@/services/chatService'
import { AnalyticsUtils } from '@/services/chatUtils'
import { 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  ChartBarIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface ChatAnalyticsProps {
  days?: number
  showTrends?: boolean
  showDetails?: boolean
}

export default function ChatAnalytics({ 
  days = 30, 
  showTrends = true, 
  showDetails = true 
}: ChatAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(days)
  
  // Fetch analytics data
  const { data: analyticsData, isLoading: isLoadingAnalytics } = useChatAnalytics(selectedPeriod)
  const { data: statsData, isLoading: isLoadingStats } = useConversationStats()

  const [trendData, setTrendData] = useState<{ dates: string[]; counts: number[] }>({ dates: [], counts: [] })

  // Process trend data when analytics data changes
  useEffect(() => {
    if (analyticsData) {
      // This would be processed from the backend data
      // For now, we'll create mock trend data
      const mockTrends = AnalyticsUtils.getTrends([], selectedPeriod)
      setTrendData(mockTrends)
    }
  }, [analyticsData, selectedPeriod])

  if (isLoadingAnalytics || isLoadingStats) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const analytics = analyticsData || {
    total_conversations: 0,
    active_conversations: 0,
    resolved_conversations: 0,
    average_messages_per_conversation: 0,
    average_response_time: 0,
    satisfaction_score: 0,
    common_intents: [],
    resolution_types: {}
  }

  const stats = statsData || {
    total_conversations: 0,
    active_conversations: 0,
    resolved_conversations: 0,
    average_response_time: 0,
    satisfaction_score: 0
  }

  // Use analytics data if available, otherwise fall back to stats
  const data = analyticsData?.results ? analyticsData.results : (stats?.results ? stats.results : analytics)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chat Analytics</h3>
            <p className="text-sm text-gray-500">Conversation insights and performance metrics</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(Number(e.target.value))}
            className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Total Conversations */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-700">Total Conversations</p>
              <p className="text-2xl font-bold text-blue-900">{data.total_conversations}</p>
            </div>
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Active Conversations */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-700">Active Conversations</p>
              <p className="text-2xl font-bold text-green-900">{data.active_conversations}</p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-green-600" />
          </div>
        </div>

        {/* Average Response Time */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">Avg Response Time</p>
              <p className="text-2xl font-bold text-purple-900">
                {data.average_response_time ? `${data.average_response_time.toFixed(1)}s` : 'N/A'}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-700">Satisfaction Score</p>
              <p className="text-2xl font-bold text-amber-900">
                {data.satisfaction_score ? `${data.satisfaction_score.toFixed(1)}/5` : 'N/A'}
              </p>
            </div>
            <StarIcon className="w-8 h-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Trends Chart */}
      {showTrends && trendData.dates.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-blue-600" />
            Conversation Trends
          </h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-end justify-between h-32">
              {trendData.counts.map((count, index) => {
                const maxCount = Math.max(...trendData.counts)
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0
                
                return (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-blue-500 rounded-t transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(trendData.dates[index]).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Detailed Metrics */}
      {showDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resolution Types */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
              Resolution Types
            </h4>
            <div className="space-y-3">
              {analytics.resolution_types && Object.entries(analytics.resolution_types).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">
                    {type.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{count as number}</span>
                </div>
              ))}
              {(!analytics.resolution_types || Object.keys(analytics.resolution_types).length === 0) && (
                <p className="text-sm text-gray-500">No resolution data available</p>
              )}
            </div>
          </div>

          {/* Common Intents */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DocumentTextIcon className="w-5 h-5 text-blue-600" />
              Common Intents
            </h4>
            <div className="space-y-3">
              {analytics.common_intents && analytics.common_intents.slice(0, 5).map((intent: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">
                    {intent.intent.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{intent.count}</span>
                </div>
              ))}
              {(!analytics.common_intents || analytics.common_intents.length === 0) && (
                <p className="text-sm text-gray-500">No intent data available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Performance Indicators */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">Resolution Rate</p>
          <p className="text-2xl font-bold text-blue-900">
            {data.total_conversations > 0 
              ? `${((data.resolved_conversations / data.total_conversations) * 100).toFixed(1)}%`
              : '0%'
            }
          </p>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">Avg Messages/Conversation</p>
          <p className="text-2xl font-bold text-green-900">
            {analytics.average_messages_per_conversation 
              ? analytics.average_messages_per_conversation.toFixed(1)
              : 'N/A'
            }
          </p>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">Response Efficiency</p>
          <p className="text-2xl font-bold text-purple-900">
            {data.average_response_time 
              ? data.average_response_time < 5 ? 'Excellent' 
                : data.average_response_time < 10 ? 'Good'
                : 'Needs Improvement'
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
