import IncidentForm from '@/components/incidents/IncidentForm'
import ProtectedRoute from '@/components/common/ProtectedRoute'

export default function ReportPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen py-8">
        <IncidentForm />
      </div>
    </ProtectedRoute>
  )
}