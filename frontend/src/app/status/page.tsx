import StatusLookup from '@/components/incidents/StatusLookup'
import ProtectedRoute from '@/components/common/ProtectedRoute'

export default function StatusPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8">
        <StatusLookup />
      </div>
    </ProtectedRoute>
  )
}