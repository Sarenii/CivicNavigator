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
  StarIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { ConversationList, ChatSession } from '../../../types/chat'
import { useConversationList } from '@/services/chatService'
import ChatInterface from './ChatInterface'
import { toast } from 'sonner'

export default function ChatLayout() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [currentChatId, setCurrentChatId] = useState<string>('')
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [editingChatId, setEditingChatId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  // Fetch conversations from backend
  const { data: conversationsData, isLoading: isLoadingConversations, error: conversationsError } = useConversationList()

  // Convert backend conversations to frontend format
  useEffect(() => {
    if (conversationsData?.results) {
      const convertedSessions: ChatSession[] = conversationsData.results.map(conv => ({
        id: conv.session_id,
        title: conv.title || 'Untitled Conversation',
        lastMessage: conv.latest_message?.text || 'No messages yet',
        timestamp: new Date(conv.created_at),
        isPinned: false // Backend doesn't have pin functionality yet
      }))

      setChatSessions(convertedSessions)
      
      // Set current chat to first conversation if none selected
      if (!currentChatId && convertedSessions.length > 0) {
        setCurrentChatId(convertedSessions[0].id)
      }
    } else if (conversationsData && Array.isArray(conversationsData)) {
      // Handle case where backend returns array directly
      const convertedSessions: ChatSession[] = conversationsData.map(conv => ({
        id: conv.session_id,
        title: conv.title || 'Untitled Conversation',
        lastMessage: conv.latest_message?.text || 'No messages yet',
        timestamp: new Date(conv.created_at),
        isPinned: false
      }))

      setChatSessions(convertedSessions)
      
      if (!currentChatId && convertedSessions.length > 0) {
        setCurrentChatId(convertedSessions[0].id)
      }
    }
  }, [conversationsData, currentChatId, isLoadingConversations, conversationsError])

  // Handle conversation loading errors
  useEffect(() => {
    if (conversationsError) {
      toast.error('Failed to load conversations', {
        description: 'Please try refreshing the page.'
      })
    }
  }, [conversationsError])

  const createNewChat = () => {
    // This will be handled by ChatInterface when user sends first message
    const newChatId = `new-${Date.now()}`
    setCurrentChatId(newChatId)
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
      setCurrentChatId(remainingChats[0]?.id || '')
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

  const handleTitleUpdate = (title: string) => {
    if (currentChatId) {
      setChatSessions(prev => 
        prev.map(s => s.id === currentChatId ? { ...s, title } : s)
      )
    }
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 overflow-hidden relative">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      <div className={`${
        isSidebarOpen ? 'w-80' : 'w-0'
      } md:relative fixed left-0 top-0 transition-all duration-300 ease-in-out overflow-hidden bg-white/95 backdrop-blur-xl border-r border-slate-200/60 flex flex-col h-full shadow-2xl z-30`}>
        
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200/60 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">CitizenNavigator</h2>
                <p className="text-xs text-slate-500">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100/80 transition-all duration-200 md:hidden"
              aria-label="Close sidebar"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          
          {/* New Chat Button */}
          <button
            onClick={createNewChat}
            className="w-full flex items-center gap-3 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transform hover:scale-[1.02]"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">New Chat</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-slate-200/60 bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Quick Actions</h3>
          <div className="space-y-2">
            <button
              onClick={() => window.location.href = '/report'}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white rounded-xl transition-all duration-200 group border border-transparent hover:border-red-200/60 hover:shadow-lg hover:shadow-red-500/10 transform hover:scale-[1.01]"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-red-500/25">
                <ExclamationTriangleIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Report Issue</div>
                <div className="text-xs text-slate-500">File an incident report</div>
              </div>
            </button>
            <button
              onClick={() => window.location.href = '/status'}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-white rounded-xl transition-all duration-200 group border border-transparent hover:border-blue-200/60 hover:shadow-lg hover:shadow-blue-500/10 transform hover:scale-[1.01]"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-lg shadow-blue-500/25">
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-800">Check Status</div>
                <div className="text-xs text-slate-500">Track your reports</div>
              </div>
            </button>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Recent Conversations</h3>
          
          {isLoadingConversations ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : chatSessions.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">No conversations yet</p>
              <p className="text-xs text-slate-400 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            <div className="space-y-2">
              {chatSessions
                .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))
                .map((session) => (
                <div
                  key={session.id}
                  className={`group relative rounded-xl transition-all duration-200 ${
                    currentChatId === session.id 
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 shadow-lg shadow-blue-500/10' 
                      : 'hover:bg-white/80 hover:shadow-md border border-transparent hover:border-slate-200/60'
                  }`}
                >
                  {editingChatId === session.id ? (
                    <div className="p-3">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename()
                          if (e.key === 'Escape') cancelRename()
                        }}
                        onBlur={saveRename}
                        className="w-full bg-white text-slate-900 text-sm px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400"
                        autoFocus
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => selectChat(session.id)}
                      className="w-full text-left p-3 flex items-start gap-3"
                    >
                      <div className="flex items-center gap-2">
                      {session.isPinned && (
                          <div className="w-2 h-2 bg-amber-400 rounded-full shadow-sm"></div>
                      )}
                        <div className={`w-2 h-2 rounded-full ${
                          currentChatId === session.id ? 'bg-blue-500' : 'bg-slate-300'
                        }`}></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold truncate mb-1 ${
                          currentChatId === session.id ? 'text-blue-900' : 'text-slate-800'
                        }`}>
                          {session.title}
                        </div>
                        <div className="text-xs text-slate-500 truncate leading-relaxed">
                          {session.lastMessage || 'No messages yet'}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {session.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </button>
                  )}

                  {!editingChatId && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <div className="flex gap-1 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-200/60 p-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePin(session.id)
                          }}
                          className={`p-2 rounded-md hover:bg-slate-100 transition-colors duration-200 ${
                            session.isPinned ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'
                          }`}
                          title={session.isPinned ? 'Unpin chat' : 'Pin chat'}
                        >
                          < StarIcon className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            startRename(session.id, session.title)
                          }}
                          className="p-2 rounded-md hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors duration-200"
                          title="Rename chat"
                        >
                          <PencilIcon className="w-3.5 h-3.5" />
                        </button>
                        
                        {chatSessions.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm('Delete this chat? This action cannot be undone.')) {
                                deleteChat(session.id)
                              }
                            }}
                            className="p-2 rounded-md hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors duration-200"
                            title="Delete chat"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-slate-200/60 bg-gradient-to-r from-slate-50/80 to-blue-50/40 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/25 ring-2 ring-white/80">
              <span className="text-sm font-bold text-white">
                {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-800 truncate">{user?.full_name}</div>
              <div className="text-xs text-slate-500 capitalize">{user?.role?.name}</div>
            </div>
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Bar */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-slate-600 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 shadow-sm hover:shadow-md"
                aria-label="Open sidebar"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-lg md:text-xl font-bold text-slate-800 truncate">
                {chatSessions.find(s => s.id === currentChatId)?.title || 'New Chat'}
              </h1>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Municipal Services Assistant
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden md:block text-slate-600 hover:text-slate-800 p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-200 shadow-sm hover:shadow-md"
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
            onTitleUpdate={handleTitleUpdate}
          />
        </div>
      </div>
    </div>
  )
}

