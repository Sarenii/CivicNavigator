import ChatLayout from '@/components/chat/ChatLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import IncidentForm from '@/components/incidents/IncidentForm'

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8">
        <ChatLayout />
      </div>
    </ProtectedRoute>
  )
}