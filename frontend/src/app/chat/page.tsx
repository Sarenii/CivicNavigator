import ChatLayout from '@/components/chat/ChatLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'

export default function ChatPage() {
  return (

      <div className="h-screen -m-4"> {/* Remove container padding for full-screen */}
        <ChatLayout />
      </div>
    
  )
}