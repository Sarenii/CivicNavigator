import { Citation, Message } from '../../types/chat'
import { useSubmitFeedback } from './chatService'

// Message utility functions
export class MessageUtils {
  static formatTimestamp(timestamp: string): string {
    try {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
      
      if (diffInHours < 1) {
        return 'Just now'
      } else if (diffInHours < 24) {
        const hours = Math.floor(diffInHours)
        return `${hours}h ago`
      } else if (diffInHours < 48) {
        return 'Yesterday'
      } else {
        return date.toLocaleDateString()
      }
    } catch {
      return 'Unknown time'
    }
  }

  static getConfidenceColor(confidence: number): string {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    if (confidence >= 0.4) return 'text-orange-600'
    return 'text-red-600'
  }

  static getConfidenceText(confidence: number): string {
    if (confidence >= 0.8) return 'High confidence'
    if (confidence >= 0.6) return 'Medium confidence'
    if (confidence >= 0.4) return 'Low confidence'
    return 'Very low confidence'
  }

  static getMessageTypeIcon(messageType: string): string {
    const icons: Record<string, string> = {
      'text': '💬',
      'clarification': '❓',
      'options': '📋',
      'confirmation': '✅',
      'error': '⚠️',
      'system_info': 'ℹ️'
    }
    return icons[messageType] || '💬'
  }

  static getMessageIntent(message: Message): string {
    if (!message.intent) return 'Unknown'
    
    const intentMap: Record<string, string> = {
      'question': 'Question',
      'incident_report': 'Incident Report',
      'status_check': 'Status Check',
      'service_info': 'Service Information',
      'complaint': 'Complaint',
      'general': 'General Inquiry'
    }
    
    return intentMap[message.intent] || message.intent
  }

  static isMessageFromToday(message: Message): boolean {
    const messageDate = new Date(message.created_at)
    const today = new Date()
    return messageDate.toDateString() === today.toDateString()
  }

  static getMessageAge(message: Message): string {
    const messageDate = new Date(message.created_at)
    const now = new Date()
    const diffInMinutes = (now.getTime() - messageDate.getTime()) / (1000 * 60)
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)}m ago`
    
    const diffInHours = diffInMinutes / 60
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    
    const diffInDays = diffInHours / 24
    if (diffInDays < 7) return `${Math.floor(diffInDays)}d ago`
    
    return messageDate.toLocaleDateString()
  }
}

// Citation utility functions
export class CitationUtils {
  static validateCitation(citation: Citation): boolean {
    return !!(citation.title && citation.snippet)
  }

  static formatCitationTitle(title: string): string {
    if (title.length > 60) {
      return title.substring(0, 60) + '...'
    }
    return title
  }

  static extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname
      return domain.replace('www.', '')
    } catch {
      return 'Unknown source'
    }
  }

  static getCitationType(citation: Citation): string {
    if (citation.source_link?.includes('pdf')) return 'PDF'
    if (citation.source_link?.includes('gov')) return 'Government'
    if (citation.source_link?.includes('news')) return 'News'
    return 'Document'
  }

  static sortCitationsByRelevance(citations: Citation[]): Citation[] {
    return citations.sort((a, b) => {
      // Sort by source quality and content length
      const aScore = this.getCitationScore(a)
      const bScore = this.getCitationScore(b)
      return bScore - aScore
    })
  }

  private static getCitationScore(citation: Citation): number {
    let score = 0
    
    // Prefer government sources
    if (citation.source_link?.includes('gov')) score += 10
    if (citation.source_link?.includes('official')) score += 5
    
    // Prefer longer, more detailed snippets
    score += Math.min(citation.snippet.length / 10, 5)
    
    // Prefer citations with titles
    if (citation.title) score += 2
    
    return score
  }
}

// Feedback utility functions
export class FeedbackUtils {
  static async submitMessageFeedback(
    conversationId: string, 
    messageId: number, 
    isPositive: boolean
  ): Promise<void> {
    try {
      const feedbackData = {
        feedback_type: 'thumbs',
        is_positive: isPositive,
        feedback_text: isPositive ? 'User found this helpful' : 'User found this unhelpful',
        categories: isPositive ? ['helpful', 'accurate'] : ['unhelpful', 'inaccurate']
      }

      // Use the feedback submission hook
      const submitFeedback = useSubmitFeedback(conversationId)
      await submitFeedback.mutateAsync({ item: feedbackData as any })
      
      console.log('Feedback submitted successfully')
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      throw error
    }
  }

  static async submitConversationRating(
    conversationId: string,
    rating: number,
    feedbackText?: string
  ): Promise<void> {
    try {
      const feedbackData = {
        feedback_type: 'rating',
        rating,
        feedback_text: feedbackText || `User rated conversation ${rating}/5`,
        categories: rating >= 4 ? ['satisfied', 'helpful'] : rating >= 3 ? ['neutral'] : ['dissatisfied', 'unhelpful']
      }

      const submitFeedback = useSubmitFeedback(conversationId)
      await submitFeedback.mutateAsync({ item: feedbackData as any })
      
      console.log('Conversation rating submitted successfully')
    } catch (error) {
      console.error('Failed to submit conversation rating:', error)
      throw error
    }
  }

  static async submitDetailedFeedback(
    conversationId: string,
    feedbackText: string,
    categories: string[]
  ): Promise<void> {
    try {
      const feedbackData = {
        feedback_type: 'detailed',
        feedback_text: feedbackText,
        categories
      }

      const submitFeedback = useSubmitFeedback(conversationId)
      await submitFeedback.mutateAsync({ item: feedbackData as any })
      
      console.log('Detailed feedback submitted successfully')
    } catch (error) {
      console.error('Failed to submit detailed feedback:', error)
      throw error
    }
  }
}

// Conversation utility functions
export class ConversationUtils {
  static generateConversationTitle(messages: Message[]): string {
    const userMessages = messages.filter(m => m.sender === 'user')
    if (userMessages.length === 0) return 'New Conversation'
    
    const firstMessage = userMessages[0].text
    if (firstMessage.length <= 50) {
      return firstMessage
    }
    
    return firstMessage.substring(0, 50) + '...'
  }

  static getConversationSummary(messages: Message[]): string {
    const botMessages = messages.filter(m => m.sender === 'bot')
    if (botMessages.length === 0) return 'No responses yet'
    
    const lastBotMessage = botMessages[botMessages.length - 1]
    return lastBotMessage.text.substring(0, 100) + (lastBotMessage.text.length > 100 ? '...' : '')
  }

  static getConversationStats(messages: Message[]): {
    totalMessages: number
    userMessages: number
    botMessages: number
    averageResponseTime: number
  } {
    const userMessages = messages.filter(m => m.sender === 'user')
    const botMessages = messages.filter(m => m.sender === 'bot')
    
    let totalResponseTime = 0
    let responseCount = 0
    
    for (let i = 0; i < messages.length - 1; i++) {
      if (messages[i].sender === 'user' && messages[i + 1].sender === 'bot') {
        const userTime = new Date(messages[i].created_at).getTime()
        const botTime = new Date(messages[i + 1].created_at).getTime()
        totalResponseTime += (botTime - userTime) / 1000 // Convert to seconds
        responseCount++
      }
    }
    
    return {
      totalMessages: messages.length,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      averageResponseTime: responseCount > 0 ? totalResponseTime / responseCount : 0
    }
  }

  static isConversationActive(messages: Message[]): boolean {
    if (messages.length === 0) return false
    
    const lastMessage = messages[messages.length - 1]
    const lastMessageTime = new Date(lastMessage.created_at).getTime()
    const now = new Date().getTime()
    const hoursSinceLastMessage = (now - lastMessageTime) / (1000 * 60 * 60)
    
    return hoursSinceLastMessage < 24 // Consider active if last message was within 24 hours
  }

  static getConversationIntent(messages: Message[]): string {
    const userMessages = messages.filter(m => m.sender === 'user')
    if (userMessages.length === 0) return 'general'
    
    // Analyze first user message for intent
    const firstMessage = userMessages[0].text.toLowerCase()
    
    if (firstMessage.includes('report') || firstMessage.includes('issue') || firstMessage.includes('problem')) {
      return 'incident_report'
    }
    
    if (firstMessage.includes('status') || firstMessage.includes('check') || firstMessage.includes('track')) {
      return 'status_check'
    }
    
    if (firstMessage.includes('permit') || firstMessage.includes('license') || firstMessage.includes('apply')) {
      return 'service_info'
    }
    
    if (firstMessage.includes('waste') || firstMessage.includes('garbage') || firstMessage.includes('collection')) {
      return 'service_info'
    }
    
    if (firstMessage.includes('water') || firstMessage.includes('electricity') || firstMessage.includes('utility')) {
      return 'service_info'
    }
    
    return 'general'
  }
}

// AI Response utility functions
export class AIResponseUtils {
  static extractSuggestedActions(response: any): string[] {
    if (response.suggested_actions && Array.isArray(response.suggested_actions)) {
      return response.suggested_actions
    }
    return []
  }

  static extractCitations(response: any): Citation[] {
    if (response.message?.citations && Array.isArray(response.message.citations)) {
      return response.message.citations
    }
    return []
  }

  static extractConfidence(response: any): number | undefined {
    return response.message?.confidence
  }

  static extractIntent(response: any): string | undefined {
    return response.message?.intent
  }

  static extractEntities(response: any): Record<string, any> | undefined {
    return response.message?.entities
  }

  static isIncidentCreated(response: any): boolean {
    return response.conversation?.resolution_type === 'incident_created'
  }

  static isConversationResolved(response: any): boolean {
    return response.conversation?.is_resolved === true
  }

  static getResolutionType(response: any): string | undefined {
    return response.conversation?.resolution_type
  }
}


