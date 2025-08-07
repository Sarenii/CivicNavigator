// hooks/useNotifications.ts

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Notification, NotificationHookReturn } from '../../types'

export const useNotifications = (): NotificationHookReturn => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true) // Start with loading true

  // Mock data for development - replace with actual API calls
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Incident Report Updated',
      message: 'Your streetlight repair request #SL-2024-001 has been assigned to maintenance team.',
      type: 'update',
      priority: 'medium',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      read: false,
      actionUrl: '/status/SL-2024-001',
      actionLabel: 'View Details',
      metadata: { incidentId: 'SL-2024-001' }
    },
    {
      id: '2',
      title: 'New Message from Support',
      message: 'We need additional information about your water service complaint.',
      type: 'message',
      priority: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      read: false,
      actionUrl: '/chat',
      actionLabel: 'Reply',
      metadata: { chatId: 'chat-123' }
    },
    {
      id: '3',
      title: 'Maintenance Completed',
      message: 'Your waste collection complaint has been resolved. Service has been restored.',
      type: 'success',
      priority: 'medium',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      read: true,
      actionUrl: '/status/WC-2024-005',
      actionLabel: 'View Report',
      metadata: { incidentId: 'WC-2024-005' }
    },
    {
      id: '4',
      title: 'System Maintenance Alert',
      message: 'Scheduled maintenance on Sunday 3 AM - 6 AM. Some services may be temporarily unavailable.',
      type: 'warning',
      priority: 'low',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      read: true,
      metadata: {}
    },
    {
      id: '5',
      title: 'Account Security',
      message: 'Your password was successfully changed. If this wasn\'t you, contact support immediately.',
      type: 'info',
      priority: 'medium',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      read: true,
      metadata: {}
    }
  ]

  const fetchNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([])
      setIsLoading(false)
      return
    }
    
    setIsLoading(true)
    
    try {
      // In production, this would be an API call
      if (process.env.NODE_ENV === 'development') {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))
        setNotifications(mockNotifications)
      } else {
        // Production API call
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': `Bearer ${user.id}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const data = await response.json()
          setNotifications(data.notifications || [])
        } else {
          setNotifications([])
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      // In case of error, show mock data for development
      if (process.env.NODE_ENV === 'development') {
        setNotifications(mockNotifications)
      } else {
        setNotifications([])
      }
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        )
      )

      if (process.env.NODE_ENV !== 'development') {
        // Production API call
        await fetch(`/api/notifications/${notificationId}/read`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${user?.id}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
      // Revert optimistic update on error
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: false }
            : notification
        )
      )
    }
  }, [user])

  const markAllAsRead = useCallback(async () => {
    try {
      // Optimistic update
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      )

      if (process.env.NODE_ENV !== 'development') {
        // Production API call
        await fetch('/api/notifications/read-all', {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${user?.id}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      // Revert on error - would need to store previous state for proper revert
      await fetchNotifications()
    }
  }, [user, fetchNotifications])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      // Optimistic update
      const previousNotifications = notifications
      setNotifications(prev => prev.filter(n => n.id !== notificationId))

      if (process.env.NODE_ENV !== 'development') {
        // Production API call
        const response = await fetch(`/api/notifications/${notificationId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.id}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to delete notification')
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
      // Revert optimistic update on error
      setNotifications(notifications)
    }
  }, [notifications, user])

  const addNotification = useCallback((newNotification: Omit<Notification, 'id' | 'timestamp'>) => {
    const notification: Notification = {
      ...newNotification,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    
    setNotifications(prev => [notification, ...prev])
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications()
    } else {
      setNotifications([])
    }
  }, [user, fetchNotifications])

  // Simulate real-time notifications in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && user) {
      const interval = setInterval(() => {
        // Randomly add a new notification (10% chance every 30 seconds)
        if (Math.random() < 0.1) {
          const randomNotifications = [
            {
              title: 'New System Update',
              message: 'A new feature has been added to improve your experience.',
              type: 'info' as const,
              priority: 'low' as const,
              read: false,
              metadata: {}
            },
            {
              title: 'Incident Update',
              message: 'Your recent report has been reviewed by our team.',
              type: 'update' as const,
              priority: 'medium' as const,
              read: false,
              actionUrl: '/status',
              actionLabel: 'View Status',
              metadata: {}
            }
          ]
          
          const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
          addNotification(randomNotification)
        }
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [user, addNotification])

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    addNotification
  }
}