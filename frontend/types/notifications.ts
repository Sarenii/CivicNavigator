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
}