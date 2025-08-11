# civic-navigator-chatbot-frontend
frontend files for civic-navigator-chatbot




Index.ts

export * from './ai_service';
export * from './auth';
export * from './chat';
export * from './core';
export * from './incident';
export * from './knowledge_base';
export * from './notifications';
export * from './staff';
export * from './user';
export * from './incident';





NOTIFICATIONS

/**
 * Represents a notification channel.
 */
export interface NotificationChannel {
  id: number;
  name: string;
  channel_type: string;
  channel_type_display: string;
  description?: string;
  is_active: boolean;
  is_system_channel: boolean;
  rate_limit_per_hour?: number;
  rate_limit_per_day?: number;
  is_healthy: boolean;
  failure_count: number;
}

/**
 * Represents a notification template.
 */
export interface NotificationTemplate {
  id: number;
  name: string;
  template_type: string;
  template_type_display: string;
  description?: string;
  email_subject?: string;
  email_body_html?: string;
  email_body_text?: string;
  sms_content?: string;
  push_title?: string;
  push_body?: string;
  in_app_title?: string;
  in_app_content?: string;
  available_variables: string[];
  variables_list: string[];
  is_active: boolean;
  requires_user_consent: boolean;
  usage_count: number;
}

/**
 * Represents a notification rule.
 */
export interface NotificationRule {
  id: number;
  name: string;
  description?: string;
  trigger_event: string;
  trigger_conditions?: any;
  recipient_type: string;
  recipient_roles: string[];
  roles_list: string[];
  template: number;
  template_name: string;
  channels: number[];
  channels_info: {
    id: number;
    name: string;
    type: string;
  }[];
  send_immediately: boolean;
  delay_minutes?: number;
  deduplicate_window_minutes?: number;
  is_active: boolean;
  trigger_count: number;
  last_triggered?: string;
}

/**
 * Represents a simplified view of a notification for lists.
 */
export interface NotificationList {
  id: number;
  notification_id: string;
  title: string;
  content: string;
  channel_name: string;
  status: string;
  status_display: string;
  priority: string;
  priority_display: string;
  scheduled_at?: string;
  sent_at?: string;
  read_at?: string;
  time_since_created: string;
  created_at: string;
}

/**
 * Represents a detailed view of a notification.
 */
export interface NotificationDetail {
  id: number;
  notification_id: string;
  title: string;
  content: string;
  recipient?: number;
  template: NotificationTemplate;
  channel: NotificationChannel;
  priority: string;
  priority_display: string;
  status: string;
  status_display: string;
  scheduled_at?: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  clicked_at?: string;
  click_count: number;
  delivery_attempts: number;
  max_attempts: number;
  error_message?: string;
  context_data?: any;
  metadata?: any;
  created_at: string;
  updated_at: string;
}

/**
 * Represents user notification preferences.
 */
export interface NotificationPreference {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  incident_updates: boolean;
  assignment_notifications: boolean;
  comment_notifications: boolean;
  system_announcements: boolean;
  weekly_reports: boolean;
  monthly_reports: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  timezone?: string;
  digest_frequency?: string;
  template_preferences?: any;
}

/**
 * Represents a notification digest.
 */
export interface NotificationDigest {
  id: number;
  frequency: string;
  start_time: string;
  end_time: string;
  notification_count: number;
  notifications_preview: string[];
  is_sent: boolean;
  sent_at?: string;
  created_at: string;
}

/**
 * Represents data for sending bulk notifications.
 */
export interface BulkNotificationData {
  recipient_ids: number[];
  template_id: number;
  channel_ids: number[];
  priority?: string;
  scheduled_at?: string;
  context_data?: any;
}// types/notifications.ts

export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'update' | 'message'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
  metadata?: {
    incidentId?: string
    chatId?: string
    userId?: string
    [key: string]: any
  }
}

export interface NotificationPreferences {
  userId: string
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  notificationTypes: {
    incidentUpdates: boolean
    systemMessages: boolean
    chatMessages: boolean
    statusChanges: boolean
    maintenanceAlerts: boolean
  }
}

export interface NotificationComponentProps {
  notifications: Notification[]
  onMarkAsRead: (notificationId: string) => void
  onMarkAllAsRead: () => void
  onDeleteNotification: (notificationId: string) => void
  onNotificationClick: (notification: Notification) => void
}

export interface NotificationBadgeProps {
  count: number
  showBadge?: boolean
  maxCount?: number
}

export interface NotificationDropdownProps extends NotificationComponentProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}

export interface NotificationHookReturn {
  notifications: Notification[]
  unreadCount: number
  isLoading: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  fetchNotifications: () => Promise<void>
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void
}



STAFF

/**
 * Represents a department within the organization.
 */
export interface Department {
  id: number;
  name: string;
  description?: string;
  parent?: number;
  full_path: string;
  head_of_department?: number;
  head_of_department_name: string;
  email?: string;
  phone?: string;
  address?: string;
  service_areas: string[];
  service_areas_list: string[];
  wards_covered: string[];
  wards_list: string[];
  constituencies_covered: string[];
  constituencies_list: string[];
  is_active: boolean;
  auto_assignment_enabled: boolean;
  total_staff: number;
  active_incidents: number;
  avg_resolution_time_hours?: number;
  children_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a staff member's schedule.
 */
export interface StaffSchedule {
  id: number;
  staff_member: number;
  staff_member_name: string;
  schedule_type: string;
  schedule_type_display: string;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  is_all_day: boolean;
  is_recurring: boolean;
  recurrence_pattern?: string;
  is_available_for_incidents: boolean;
  max_concurrent_incidents?: number;
  location?: string;
  is_remote: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a work log entry for a staff member.
 */
export interface WorkLog {
  id: number;
  staff_member: number;
  staff_member_name: string;
  log_type: string;
  log_type_display: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  related_incident?: string;
  related_incident_id?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  is_verified: boolean;
  verified_by?: number;
  verified_by_name?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents an assignment of a staff member to an incident.
 */
export interface StaffAssignment {
  id: number;
  incident: string;
  incident_id: string;
  staff_member: number;
  staff_member_name: string;
  assignment_type: string;
  assignment_type_display: string;
  status: string;
  status_display: string;
  assigned_by?: number;
  assigned_by_name: string;
  assigned_at: string;
  acknowledged_at?: string;
  accepted_at?: string;
  declined_at?: string;
  completed_at?: string;
  assignment_notes?: string;
  response_notes?: string;
  estimated_hours?: number;
  actual_hours?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents performance metrics for a staff member.
 */
export interface StaffPerformanceMetrics {
  id: number;
  staff_member: number;
  staff_member_name: string;
  period_start: string;
  period_end: string;
  period_type: string;
  period_type_display: string;
  total_incidents_assigned: number;
  total_incidents_completed: number;
  total_incidents_overdue: number;
  completion_rate: number;
  avg_response_time_hours?: number;
  avg_resolution_time_hours?: number;
  total_work_hours: number;
  satisfaction_rating_avg?: number;
  satisfaction_response_count: number;
  complaint_count: number;
  incidents_per_hour: number;
  sla_compliance_rate: number;
  knowledge_articles_created: number;
  training_sessions_attended: number;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a bulk action performed by staff.
 */
export interface BulkAction {
  id: number;
  action_id: string;
  action_type: string;
  action_type_display: string;
  description?: string;
  executed_by?: number;
  executed_by_name: string;
  target_count: number;
  processed_count: number;
  success_count: number;
  error_count: number;
  progress_percentage: number;
  status: string;
  status_display: string;
  started_at?: string;
  completed_at?: string;
  action_params?: any;
  results?: any;
  error_log?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Represents a generated report.
 */
export interface Report {
  id: number;
  report_id: string;
  title: string;
  report_type: string;
  report_type_display: string;
  description?: string;
  generated_by?: number;
  generated_by_name: string;
  report_params?: any;
  date_range_start: string;
  date_range_end: string;
  report_format: string;
  report_format_display: string;
  file_path?: string;
  file_size?: number;
  file_size_mb: number;
  status: string;
  status_display: string;
  generation_started_at?: string;
  generation_completed_at?: string;
  expires_at?: string;
  is_expired: boolean;
  download_count: number;
  last_downloaded_at?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents data for bulk assignment of staff to incidents.
 */
export interface BulkAssignmentData {
  incident_ids: number[];
  staff_member_id: number;
  assignment_type: string;
  assignment_notes?: string;
  estimated_hours?: number;
}

/**
 * Represents data for bulk status updates of incidents.
 */
export interface BulkStatusUpdateData {
  incident_ids: number[];
  new_status: string;
  update_notes?: string;
  notify_stakeholders: boolean;
}

/**
 * Represents data for generating a report.
 */
export interface ReportGenerationData {
  title: string;
  report_type: string;
  description?: string;
  date_range_start: string;
  date_range_end: string;
  report_format: string;
  report_params?: any;
}
// types/staff.ts

import { IncidentDetail, IncidentStatus, IncidentCategory } from './incident'

// ===============================
// Staff Incident Management Types
// ===============================

export interface StaffIncidentFilter {
  status?: IncidentStatus[]
  category?: IncidentCategory[]
  assigned_to?: string
  date_from?: string
  date_to?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  search?: string
}

export interface IncidentUpdateData {
  status?: IncidentStatus
  notes?: string
  assigned_to?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  resolution_notes?: string
}

export interface StaffMember {
  id: string
  name: string
  email: string
  department: string
  is_active: boolean
}

export interface IncidentListItem extends IncidentDetail {
  assigned_to_name?: string
  days_open: number
  is_overdue: boolean
}

// ===============================
// Component Props
// ===============================

export interface StaffIncidentListProps {
  incidents: IncidentListItem[]
  isLoading: boolean
  onIncidentSelect: (incident: IncidentListItem) => void
  onStatusUpdate: (incidentId: string, updates: IncidentUpdateData) => void
  filter: StaffIncidentFilter
  onFilterChange: (filter: StaffIncidentFilter) => void
}

export interface IncidentDetailViewProps {
  incident: IncidentListItem | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updates: IncidentUpdateData) => void
  isUpdating: boolean
}

export interface IncidentFilterBarProps {
  filter: StaffIncidentFilter
  onFilterChange: (filter: StaffIncidentFilter) => void
  onClearFilters: () => void
}

// ===============================
// API Response Types
// ===============================

export interface StaffIncidentResponse {
  results: IncidentListItem[]
  count: number
  next: string | null
  previous: string | null
}

export interface IncidentUpdateResponse {
  success: boolean
  incident: IncidentListItem
  message: string
}

/**
 * Represents a full Knowledge Base article document.
 * This is the source of truth, matching the backend model.
 */
export interface KBArticle {
  id: string;
  title: string;
  body: string;
  tags: string[];
  source: string;
  last_updated: string;
}

/**
 * Represents the data required to create or update a KB article.
 * Used as the payload for POST/PUT API requests.
 */
export type KBArticlePayload = Omit<KBArticle, 'id' | 'last_updated'> & {
  id?: string; // ID is optional, present for updates but not for creation
};
