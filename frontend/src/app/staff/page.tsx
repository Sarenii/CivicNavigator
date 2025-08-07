// app/staff/page.tsx

import StaffDashboard from '@/components/staff/StaffDashboard'
import ProtectedRoute from '@/components/common/ProtectedRoute'

export default function StaffPage() {
  return (
    <ProtectedRoute requiredRole="staff">
      <div className="-m-4"> {/* Remove container padding for full-screen */}
        <StaffDashboard />
      </div>
    </ProtectedRoute>
  )
}