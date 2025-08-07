// utils/mockData.ts

import { StaffIncident } from '../../../types'

export const getMockIncidents = (): StaffIncident[] => [
  {
    id: '1',
    incident_id: 'INC-2025-001',
    reference_number: 'INC-2025-001',
    title: 'Broken streetlight on Moi Avenue',
    description: 'The streetlight near KCB bank has been flickering and is now completely out.',
    category: 'streetlight',
    category_display: 'Street Lighting',
    status: 'NEW',
    status_display: 'New',
    priority: 'MEDIUM',
    priority_display: 'Medium',
    location: {
      type: 'text',
      text_description: 'Moi Avenue, near KCB Bank, Nairobi CBD',
      ward: 'CBD Ward',
      constituency: 'Starehe',
      county: 'Nairobi'
    },
    contact_info: {
      email: 'resident@example.com',
      name: 'John Doe',
      phone: '+254712345678'
    },
    created_at: '2025-01-08T10:30:00Z',
    updated_at: '2025-01-08T10:30:00Z',
    estimated_resolution: '2025-01-10T18:00:00Z',
    reporter: {
      name: 'John Doe',
      email: 'resident@example.com',
      phone: '+254712345678'
    },
    department: {
      id: '1',
      name: 'Infrastructure'
    },
    attachments: [],
    history: [
      {
        id: '1',
        timestamp: '2025-01-08T10:30:00Z',
        status: 'NEW',
        status_display: 'New',
        notes: 'Incident reported and logged.',
        updated_by: {
          id: '1',
          name: 'System',
          role: 'system'
        },
        is_public: true
      }
    ],
    assigned_to_name: 'Unassigned',
    days_open: 0,
    is_overdue: false,
    tags: ['lighting', 'safety', 'cbd']
  },
  {
    id: '2',
    incident_id: 'INC-2025-002',
    reference_number: 'INC-2025-002',
    title: 'Waste collection missed in South C',
    description: 'Garbage has not been collected for over a week in South C estate.',
    category: 'waste',
    category_display: 'Waste Collection',
    status: 'IN_PROGRESS',
    status_display: 'In Progress',
    priority: 'HIGH',
    priority_display: 'High',
    location: {
      type: 'text',
      text_description: 'South C Estate, Block 10-15',
      ward: 'South C Ward',
      constituency: 'Lang\'ata',
      county: 'Nairobi'
    },
    contact_info: {
      email: 'sarah@example.com',
      name: 'Sarah Mwangi',
      phone: '+254722334455'
    },
    created_at: '2025-01-05T14:20:00Z',
    updated_at: '2025-01-07T09:15:00Z',
    estimated_resolution: '2025-01-09T17:00:00Z',
    reporter: {
      name: 'Sarah Mwangi',
      email: 'sarah@example.com',
      phone: '+254722334455'
    },
    assigned_to: {
      id: '2',
      name: 'Mike Ochieng',
      department: 'Sanitation',
      email: 'mike.ochieng@nairobi.go.ke'
    },
    department: {
      id: '2',
      name: 'Sanitation'
    },
    attachments: [],
    history: [
      {
        id: '2',
        timestamp: '2025-01-05T14:20:00Z',
        status: 'NEW',
        status_display: 'New',
        notes: 'Incident reported',
        updated_by: {
          id: '1',
          name: 'System',
          role: 'system'
        },
        is_public: true
      },
      {
        id: '3',
        timestamp: '2025-01-07T09:15:00Z',
        status: 'IN_PROGRESS',
        status_display: 'In Progress',
        notes: 'Assigned to sanitation team.',
        updated_by: {
          id: '2',
          name: 'Mike Ochieng',
          role: 'staff'
        },
        is_public: true
      }
    ],
    assigned_to_name: 'Mike Ochieng',
    days_open: 3,
    is_overdue: false,
    tags: ['waste', 'sanitation']
  },
  {
    id: '3',
    incident_id: 'INC-2025-003',
    reference_number: 'INC-2025-003',
    title: 'Pothole on Ngong Road',
    description: 'Large pothole causing traffic disruption near Junction Mall.',
    category: 'road',
    category_display: 'Road Maintenance',
    status: 'RESOLVED',
    status_display: 'Resolved',
    priority: 'HIGH',
    priority_display: 'High',
    location: {
      type: 'text',
      text_description: 'Ngong Road, near Junction Mall',
      ward: 'Kilimani Ward',
      constituency: 'Dagoretti North',
      county: 'Nairobi'
    },
    contact_info: {
      email: 'driver@example.com',
      name: 'Peter Kariuki',
      phone: '+254733445566'
    },
    created_at: '2025-01-03T08:15:00Z',
    updated_at: '2025-01-08T16:30:00Z',
    estimated_resolution: '2025-01-08T17:00:00Z',
    actual_resolution: '2025-01-08T16:30:00Z',
    reporter: {
      name: 'Peter Kariuki',
      email: 'driver@example.com',
      phone: '+254733445566'
    },
    assigned_to: {
      id: '1',
      name: 'Mike Ochieng',
      department: 'Infrastructure',
      email: 'mike.ochieng@nairobi.go.ke'
    },
    department: {
      id: '1',
      name: 'Infrastructure'
    },
    attachments: [],
    history: [
      {
        id: '4',
        timestamp: '2025-01-03T08:15:00Z',
        status: 'NEW',
        status_display: 'New',
        notes: 'Road damage reported',
        updated_by: {
          id: '1',
          name: 'System',
          role: 'system'
        },
        is_public: true
      },
      {
        id: '5',
        timestamp: '2025-01-04T10:00:00Z',
        status: 'IN_PROGRESS',
        status_display: 'In Progress',
        notes: 'Road crew scheduled for repair',
        updated_by: {
          id: '1',
          name: 'Mike Ochieng',
          role: 'staff'
        },
        is_public: true
      },
      {
        id: '6',
        timestamp: '2025-01-08T16:30:00Z',
        status: 'RESOLVED',
        status_display: 'Resolved',
        notes: 'Pothole filled and road surface restored',
        updated_by: {
          id: '1',
          name: 'Mike Ochieng',
          role: 'staff'
        },
        is_public: true
      }
    ],
    assigned_to_name: 'Mike Ochieng',
    days_open: 5,
    is_overdue: false,
    tags: ['roads', 'traffic'],
    resolution_notes: 'Pothole filled with cold mix asphalt.'
  }
]