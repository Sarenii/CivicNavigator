'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  BellIcon, 
  XMarkIcon, 
  CheckIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid'
import { Notification, NotificationDropdownProps, NotificationType } from '../../../types'

// Notification Icon Component
const getNotificationIcon = (type: NotificationType, className: string = "w-5 h-5") => {
  switch (type) {
    case 'success':
      return <CheckCircleIcon className={`${className} text-green-500`} />
    case 'error':
      return <ExclamationCircleIcon className={`${className} text-red-500`} />
    case 'warning':
      return <ExclamationTriangleIcon className={`${className} text-amber-500`} />
    case 'message':
      return <ChatBubbleLeftIcon className={`${className} text-blue-500`} />
    case 'update':
      return <ArrowTopRightOnSquareIcon className={`${className} text-purple-500`} />
    default:
      return <InformationCircleIcon className={`${className} text-blue-500`} />
  }
}

// Notification Badge Component
interface NotificationBadgeProps {
  count: number
  showBadge?: boolean
  maxCount?: number
}

const NotificationBadge = ({ count, showBadge = true, maxCount = 99 }: NotificationBadgeProps) => {
  if (!showBadge || count === 0) return null
  
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center shadow-lg animate-pulse">
      {count > maxCount ? `${maxCount}+` : count}
    </span>
  )
}

// Individual Notification Item Component
interface NotificationItemProps {
  notification: Notification
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
  onClick: (notification: Notification) => void
}

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onClick }: NotificationItemProps) => {
  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return 'border-l-red-500 bg-red-50/50'
      case 'high':
        return 'border-l-orange-500 bg-orange-50/50'
      case 'medium':
        return 'border-l-blue-500 bg-blue-50/50'
      default:
        return 'border-l-gray-300 bg-gray-50/50'
    }
  }

  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return timestamp.toLocaleDateString()
  }

  return (
    <div 
      className={`group relative border-l-4 ${getPriorityColor()} ${
        notification.read ? 'opacity-75' : 'bg-white'
      } p-4 hover:bg-slate-50 transition-all duration-200 cursor-pointer`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type, "w-5 h-5")}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`text-sm font-semibold ${
              notification.read ? 'text-gray-700' : 'text-gray-900'
            } truncate`}>
              {notification.title}
            </h4>
            
            {!notification.read && (
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1"></div>
            )}
          </div>
          
          <p className={`text-sm ${
            notification.read ? 'text-gray-500' : 'text-gray-700'
          } mt-1 line-clamp-2`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {formatTime(notification.timestamp)}
            </span>
            
            {notification.actionUrl && notification.actionLabel && (
              <span className="text-xs text-blue-600 font-medium">
                {notification.actionLabel} →
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Actions */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
        {!notification.read && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onMarkAsRead(notification.id)
            }}
            className="p-1 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            title="Mark as read"
          >
            <CheckIcon className="w-3 h-3" />
          </button>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete(notification.id)
          }}
          className="p-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
          title="Delete notification"
        >
          <XMarkIcon className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}

// Main Notifications Dropdown Component
export default function NotificationsDropdown({
  notifications = [], // Default to empty array
  isOpen,
  onToggle,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
  onNotificationClick
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications?.filter(n => !n.read).length || 0

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={onToggle}
        className="relative p-2 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="w-5 h-5" />
        ) : (
          <BellIcon className="w-5 h-5" />
        )}
        <NotificationBadge count={unreadCount} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Notifications
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm text-blue-600 font-medium">
                    ({unreadCount} new)
                  </span>
                )}
              </h3>
              
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <BellIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  We'll notify you when something important happens
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications
                  .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onMarkAsRead={onMarkAsRead}
                      onDelete={onDeleteNotification}
                      onClick={onNotificationClick}
                    />
                  ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium py-1 text-center hover:bg-blue-50 rounded transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}