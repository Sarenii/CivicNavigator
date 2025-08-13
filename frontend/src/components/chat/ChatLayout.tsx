'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ChatBubbleLeftRightIcon, 
  ExclamationTriangleIcon, 
  ClipboardDocumentCheckIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { ConversationList, ChatSession } from '../../../types/chat'
import { useConversationList } from '@/services/chatService'
import ChatInterface from './ChatInterface'
import { toast } from 'sonner'

export default function ChatLayout() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentChatId, setCurrentChatId] = useState<string>('new-1')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])

  // Fetch conversations from backend
  const { 
    data: FetchedconversationsData, 
    isLoading: isLoadingConversations, 
    error: conversationsError,
    refetch: refetchConversations
  } = useConversationList()
  const conversationsData = FetchedconversationsData as unknown as ConversationList[]
  // Convert backend conversations to frontend format
  useEffect(() => {
    if (conversationsData) {
      const convertedSessions: ChatSession[] = conversationsData.map(conv => ({
        id: conv.session_id,
        title: conv.title || 'New Conversation',
        lastMessage: conv.latest_message?.text || 'No messages yet',
        timestamp: new Date(conv.created_at),
        isPinned: false
      }))

      setChatSessions(convertedSessions)
      
      // If no current chat selected and we have conversations, select the first one
      if (currentChatId.startsWith('new-') && convertedSessions.length > 0) {
        setCurrentChatId(convertedSessions[0].id)
      }
    }
  }, [conversationsData, currentChatId])

  // Handle conversation loading errors
  useEffect(() => {
    if (conversationsError) {
      console.error('Failed to load conversations:', conversationsError)
      toast.error('Failed to load conversations')
    }
  }, [conversationsError])

  const createNewChat = () => {
    const newChatId = `new-${Date.now()}`
    setCurrentChatId(newChatId)
    
    // Close sidebar on mobile after creating new chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    
    // Close sidebar on mobile after selecting chat
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }

  const deleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (!confirm('Delete this conversation? This action cannot be undone.')) {
      return
    }

    try {
      // Remove from local state immediately
      setChatSessions(prev => prev.filter(s => s.id !== chatId))
      
      // If deleted chat was selected, select another or create new
      if (currentChatId === chatId) {
        const remainingChats = chatSessions.filter(s => s.id !== chatId)
        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id)
        } else {
          setCurrentChatId('new-1')
        }
      }
      
      // Refresh conversations to sync with backend
      await refetchConversations()
      
      toast.success('Conversation deleted')
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast.error('Failed to delete conversation')
      // Revert local state on error
      await refetchConversations()
    }
  }

  const handleTitleUpdate = (title: string) => {
    setChatSessions(prev => 
      prev.map(session => 
        session.id === currentChatId 
          ? { ...session, title, lastMessage: 'Updated conversation' }
          : session
      )
    )
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return `${days} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isSidebarOpen ? 'w-80' : 'w-0'
      } md:relative fixed left-0 top-0 transition-all duration-300 ease-in-out overflow-hidden bg-white border-r border-gray-200 flex flex-col h-full shadow-xl z-30`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">CitizenNavigator</h2>
                <p className="text-xs text-gray-500">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => toast.info('Report feature coming soon')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white rounded-xl transition-all group border hover:border-red-200 hover:shadow-sm"
            >
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ExclamationTriangleIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Report Issue</div>
                <div className="text-xs text-gray-500">File an incident report</div>
              </div>
            </button>
            <button
              onClick={() => toast.info('Status check feature coming soon')}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white rounded-xl transition-all group border hover:border-blue-200 hover:shadow-sm"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardDocumentCheckIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-800">Check Status</div>
                <div className="text-xs text-gray-500">Track your reports</div>
              </div>
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">Recent Conversations</h3>
          
          {isLoadingConversations ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`group relative rounded-xl transition-all ${
                    currentChatId === session.id 
                      ? 'bg-blue-50 border border-blue-200 shadow-sm' 
                      : 'hover:bg-gray-50 border border-transparent hover:border-gray-200'
                  }`}
                >
                  <button
                    onClick={() => selectChat(session.id)}
                    className="w-full text-left p-4 flex items-start gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      currentChatId === session.id ? 'bg-blue-500' : 'bg-gray-300'
                    }`}></div>
                    
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-semibold truncate mb-1 ${
                        currentChatId === session.id ? 'text-blue-900' : 'text-gray-800'
                      }`}>
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {session.lastMessage}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {formatTimestamp(session.timestamp)}
                      </div>
                    </div>
                  </button>

                  {/* Delete Button */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => deleteChat(session.id, e)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete conversation"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-sm font-bold text-white">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-800 truncate">
                {user?.full_name || 'User'}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {user?.role?.name || 'Citizen'}
              </div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-100 transition-all shadow-sm"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                {chatSessions.find(s => s.id === currentChatId)?.title || 'New Chat'}
              </h1>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Municipal Services Assistant
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block text-gray-600 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-100 transition-all shadow-sm"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface 
            key={currentChatId}
            chatId={currentChatId}
            onTitleUpdate={handleTitleUpdate}
          />
        </div>
      </div>
    </div>
  )
}