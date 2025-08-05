'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
  ChatBubbleLeftRightIcon, 
  ExclamationTriangleIcon, 
  ClipboardDocumentCheckIcon,
  PlusIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import ChatInterface from './ChatInterface'

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  isPinned?: boolean
}

export default function ChatLayout() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentChatId, setCurrentChatId] = useState('1')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: '1',
      title: 'Municipal Services Questions',
      lastMessage: 'Hello! How can I help you today?',
      timestamp: new Date(),
      isPinned: false
    }
  ])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      lastMessage: '',
      timestamp: new Date(),
      isPinned: false
    }
    setChatSessions(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    setRefreshTrigger(prev => prev + 1)
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    setRefreshTrigger(prev => prev + 1)
  }

  const deleteChat = (chatId: string) => {
    if (chatSessions.length === 1) return
    
    setChatSessions(prev => prev.filter(s => s.id !== chatId))
    
    if (currentChatId === chatId) {
      const remainingChats = chatSessions.filter(s => s.id !== chatId)
      setCurrentChatId(remainingChats[0]?.id || '1')
      setRefreshTrigger(prev => prev + 1)
    }
  }

  const togglePin = (chatId: string) => {
    setChatSessions(prev => 
      prev.map(s => s.id === chatId ? { ...s, isPinned: !s.isPinned } : s)
    )
  }

  const startRename = (chatId: string, currentTitle: string) => {
    setEditingChatId(chatId)
    setEditTitle(currentTitle)
  }

  const saveRename = () => {
    if (editingChatId && editTitle.trim()) {
      setChatSessions(prev => 
        prev.map(s => s.id === editingChatId ? { ...s, title: editTitle.trim() } : s)
      )
    }
    setEditingChatId(null)
    setEditTitle('')
  }

  const cancelRename = () => {
    setEditingChatId(null)
    setEditTitle('')
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={`${
        isSidebarOpen ? 'w-72' : 'w-0'
      } md:relative fixed left-0 top-0 transition-all duration-300 overflow-hidden bg-white border-r border-gray-200 flex flex-col h-full shadow-xl z-30`}>
        
        {/* Sidebar Header */}
        <div className="p-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-3 h-3 text-white" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">CivicNavigator</h2>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 md:hidden"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-2 p-2 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 rounded-md transition-all duration-200 text-gray-700 hover:text-blue-700"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">New chat</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-3 border-b border-gray-100 bg-gray-50">
          <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Quick Actions</h3>
          <div className="space-y-1.5">
            <button
              onClick={() => window.location.href = '/report'}
              className="w-full flex items-center gap-2.5 p-2.5 text-left hover:bg-white rounded-md transition-all duration-200 group border border-transparent hover:border-red-200 hover:shadow-sm"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-500 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                <ExclamationTriangleIcon className="w-3 h-3 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-900">Report Issue</div>
                <div className="text-xs text-gray-500">File an incident</div>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/status'}
              className="w-full flex items-center gap-2.5 p-2.5 text-left hover:bg-white rounded-md transition-all duration-200 group border border-transparent hover:border-blue-200 hover:shadow-sm"
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-500 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardDocumentCheckIcon className="w-3 h-3 text-white" />
              </div>
              <div>
                <div className="text-xs font-medium text-gray-900">Check Status</div>
                <div className="text-xs text-gray-500">Track incidents</div>
              </div>
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Conversations</h3>
          <div className="space-y-1">
            {chatSessions
              .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
              .map((session) => (
              <div
                key={session.id}
                className={`group relative rounded-md transition-all duration-200 ${
                  currentChatId === session.id 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                {editingChatId === session.id ? (
                  <div className="p-2.5">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename()
                        if (e.key === 'Escape') cancelRename()
                      }}
                      onBlur={saveRename}
                      className="w-full bg-white text-gray-900 text-xs px-2 py-1 rounded border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      autoFocus
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => selectChat(session.id)}
                    className="w-full text-left p-2.5 flex items-start gap-2"
                  >
                    {session.isPinned && (
                      <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-medium truncate mb-1 ${
                        currentChatId === session.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {session.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {session.lastMessage || 'No messages yet'}
                      </div>
                    </div>
                  </button>
                )}

                {!editingChatId && (
                  <div className="absolute right-1.5 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-0.5 bg-white rounded-md shadow-md border border-gray-200 p-0.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          togglePin(session.id)
                        }}
                        className={`p-1 rounded hover:bg-gray-100 transition-colors ${
                          session.isPinned ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'
                        }`}
                        title={session.isPinned ? 'Unpin chat' : 'Pin chat'}
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8zM9 5a2 2 0 100 4h2a2 2 0 100-4H9zM7 8a1 1 0 012-1v3a1 1 0 11-2 0V8zM14 15a1 1 0 01-1 1H7a1 1 0 01-1-1v-1a1 1 0 011-1h6a1 1 0 011 1v1z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          startRename(session.id, session.title)
                        }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"
                        title="Rename chat"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      {chatSessions.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('Delete this chat?')) {
                              deleteChat(session.id)
                            }
                          }}
                          className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                          title="Delete chat"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* User Info - Moved to Bottom */}
        <div className="p-3 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 mt-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-xs font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-base md:text-lg font-semibold text-gray-900 truncate">
                {chatSessions.find(s => s.id === currentChatId)?.title || 'Chat'}
              </h1>
              <p className="text-xs md:text-sm text-gray-500">Municipal Services Assistant</p>
            </div>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface 
            key={`${currentChatId}-${refreshTrigger}`}
            chatId={currentChatId}
            onTitleUpdate={(title) => {
              setChatSessions(prev => 
                prev.map(s => s.id === currentChatId ? { ...s, title } : s)
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}