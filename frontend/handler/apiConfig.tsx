// export const BASE_URL = "http://localhost:8000";
export const BASE_URL = "https://r7rcfmw2-8000.inc1.devtunnels.ms";

// ==================================================================================
// Core Endpoints
// ==================================================================================

/**
 * @description User login endpoint.
 * @method POST
 */
export const LOGIN_URL = `${BASE_URL}/api/v1/core/auth/login/`;

/**
 * @description Refresh JWT token endpoint.
 * @method POST
 */
export const TOKEN_REFRESH_URL = `${BASE_URL}/api/v1/core/auth/token/refresh/`;

/**
 * @description User registration endpoint.
 * @method POST
 */
export const REGISTRATION_URL = `${BASE_URL}/api/v1/core/auth/registration/`;

/**
 * @description User logout endpoint.
 * @method POST
 */
export const LOGOUT_URL = `${BASE_URL}/api/v1/core/auth/logout/`;

/**
 * @description Get user details endpoint.
 * @method GET
 */
export const USER_DETAILS_URL = `${BASE_URL}/api/v1/core/auth/user/`;

/**
 * @description Change password endpoint.
 * @method POST
 */
export const PASSWORD_CHANGE_URL = `${BASE_URL}/api/v1/core/auth/password/change/`;

/**
 * @description Reset password endpoint.
 * @method POST
 */
export const PASSWORD_RESET_URL = `${BASE_URL}/api/v1/core/auth/password/reset/`;

/**
 * @description Confirm password reset endpoint.
 * @method POST
 */
export const PASSWORD_RESET_CONFIRM_URL = `${BASE_URL}/api/v1/core/auth/password/reset/confirm/`;

/**
 * @description Verify email endpoint.
 * @method POST
 */
export const VERIFY_EMAIL_URL = `${BASE_URL}/api/v1/core/auth/registration/verify-email/`;

/**
 * @description Resend email verification endpoint.
 * @method POST
 */
export const RESEND_EMAIL_VERIFICATION_URL = `${BASE_URL}/api/v1/core/auth/registration/resend-email/`;

/**
 * @description Health check endpoint.
 * @method GET
 */
export const HEALTH_CHECK_URL = `${BASE_URL}/api/v1/core/health/`;

/**
 * @description Get CSRF token endpoint.
 * @method GET
 */
export const CSRF_TOKEN_URL = `${BASE_URL}/api/v1/core/csrf-token/`;

// ==================================================================================
// Accounts Endpoints
// ==================================================================================

/**
 * @description User management endpoint (Admin only).
 * @method GET, POST
 */
export const USER_MANAGEMENT_URL = `${BASE_URL}/api/v1/accounts/users/`;

/**
 * @description User management detail endpoint (Admin only).
 * @param {number} userId - The ID of the user.
 * @method GET, PUT, DELETE
 */
export const USER_MANAGEMENT_DETAIL_URL = (userId: number) => `${BASE_URL}/api/v1/accounts/users/${userId}/`;

/**
 * @description Approve user endpoint (Admin only).
 * @param {number} userId - The ID of the user.
 * @method POST
 */
export const APPROVE_USER_URL = (userId: number) => `${BASE_URL}/api/v1/accounts/users/${userId}/approve/`;

/**
 * @description Change user role endpoint (Admin only).
 * @param {number} userId - The ID of the user.
 * @method POST
 */
export const CHANGE_USER_ROLE_URL = (userId: number) => `${BASE_URL}/api/v1/accounts/users/${userId}/change-role/`;

/**
 * @description Get user roles endpoint.
 * @method GET
 */
export const USER_ROLES_URL = `${BASE_URL}/api/v1/accounts/roles/`;

/**
 * @description Get user permissions endpoint.
 * @method GET
 */
export const USER_PERMISSIONS_URL = `${BASE_URL}/api/v1/accounts/permissions/`;

/**
 * @description Google login endpoint.
 * @method POST
 */
export const GOOGLE_LOGIN_URL = `${BASE_URL}/api/v1/accounts/auth/google/`;

/**
 * @description GitHub login endpoint.
 * @method POST
 */
export const GITHUB_LOGIN_URL = `${BASE_URL}/api/v1/accounts/auth/github/`;

/**
 * @description Facebook login endpoint.
 * @method POST
 */
export const FACEBOOK_LOGIN_URL = `${BASE_URL}/api/v1/accounts/auth/facebook/`;

/**
 * @description Get social auth URLs endpoint.
 * @method GET
 */
export const SOCIAL_AUTH_URLS_URL = `${BASE_URL}/api/v1/accounts/auth/social-urls/`;

// ==================================================================================
// Chat Endpoints
// ==================================================================================

/**
 * @description Start a new conversation endpoint.
 * @method POST
 */
export const START_CONVERSATION_URL = `${BASE_URL}/api/v1/chat/start/`;

/**
 * @description Get conversation list endpoint.
 * @method GET
 */
export const CONVERSATION_LIST_URL = `${BASE_URL}/api/v1/chat/conversations/`;

/**
 * @description Get conversation detail endpoint.
 * @param {string} sessionId - The ID of the session.
 * @method GET
 */
export const CONVERSATION_DETAIL_URL = (sessionId: string) => `${BASE_URL}/api/v1/chat/conversations/${sessionId}/`;

/**
 * @description Send a message in a conversation endpoint.
 * @param {string} sessionId - The ID of the session.
 * @method POST
 */
export const SEND_MESSAGE_URL = (sessionId: string) => `${BASE_URL}/api/v1/chat/conversations/${sessionId}/send/`;

/**
 * @description Resolve a conversation endpoint.
 * @param {string} sessionId - The ID of the session.
 * @method POST
 */
export const RESOLVE_CONVERSATION_URL = (sessionId: string) => `${BASE_URL}/api/v1/chat/conversations/${sessionId}/resolve/`;

/**
 * @description Submit feedback for a conversation endpoint.
 * @param {string} sessionId - The ID of the session.
 * @method POST
 */
export const SUBMIT_FEEDBACK_URL = (sessionId: string) => `${BASE_URL}/api/v1/chat/conversations/${sessionId}/feedback/`;

/**
 * @description Get chat analytics endpoint (Admin only).
 * @method GET
 */
export const CHAT_ANALYTICS_URL = `${BASE_URL}/api/v1/chat/analytics/`;

// ==================================================================================
// Incidents Endpoints
// ==================================================================================

/**
 * @description Incidents endpoint.
 * @method GET, POST
 */
export const INCIDENTS_URL = `${BASE_URL}/api/v1/incidents/`;

/**
 * @description Incident categories endpoint.
 * @method GET, POST
 */
export const INCIDENT_CATEGORIES_URL = `${BASE_URL}/api/v1/categories/`;

/**
 * @description Incident subcategories endpoint.
 * @method GET, POST
 */
export const INCIDENT_SUBCATEGORIES_URL = `${BASE_URL}/api/v1/subcategories/`;

/**
 * @description Incident tags endpoint.
 * @method GET, POST
 */
export const INCIDENT_TAGS_URL = `${BASE_URL}/api/v1/tags/`;

/**
 * @description Incident metrics endpoint.
 * @method GET
 */
export const INCIDENT_METRICS_URL = `${BASE_URL}/api/v1/metrics/`;

// ==================================================================================
// Knowledge Base Endpoints
// ==================================================================================

/**
 * @description Knowledge base categories endpoint.
 * @method GET, POST
 */
export const KNOWLEDGE_CATEGORIES_URL = `${BASE_URL}/api/v1/knowledge/categories/`;

/**
 * @description Knowledge base articles endpoint.
 * @method GET, POST
 */
export const KNOWLEDGE_ARTICLES_URL = `${BASE_URL}/api/v1/knowledge/articles/`;

/**
 * @description FAQs endpoint.
 * @method GET, POST
 */
export const FAQS_URL = `${BASE_URL}/api/v1/knowledge/faqs/`;

/**
 * @description Knowledge base attachments endpoint.
 * @method GET, POST
 */
export const KNOWLEDGE_ATTACHMENTS_URL = `${BASE_URL}/api/v1/knowledge/attachments/`;

// ==================================================================================
// AI Service Endpoints
// ==================================================================================

/**
 * @description AI providers endpoint.
 * @method GET, POST
 */
export const AI_PROVIDERS_URL = `${BASE_URL}/api/v1/ai/providers/`;

/**
 * @description AI models endpoint.
 * @method GET, POST
 */
export const AI_MODELS_URL = `${BASE_URL}/api/v1/ai/models/`;

/**
 * @description AI conversations endpoint.
 * @method GET, POST
 */
export const AI_CONVERSATIONS_URL = `${BASE_URL}/api/v1/ai/conversations/`;

/**
 * @description AI messages endpoint.
 * @method GET, POST
 */
export const AI_MESSAGES_URL = `${BASE_URL}/api/v1/ai/messages/`;

/**
 * @description AI prompt templates endpoint.
 * @method GET, POST
 */
export const AI_PROMPT_TEMPLATES_URL = `${BASE_URL}/api/v1/ai/templates/`;

/**
 * @description AI usage metrics endpoint.
 * @method GET
 */
export const AI_USAGE_METRICS_URL = `${BASE_URL}/api/v1/ai/metrics/`;

/**
 * @description Test AI chat endpoint.
 * @method POST
 */
export const TEST_AI_CHAT_URL = `${BASE_URL}/api/v1/ai/test/`;

/**
 * @description AI service health endpoint.
 * @method GET
 */
export const AI_SERVICE_HEALTH_URL = `${BASE_URL}/api/v1/ai/health/`;

// ==================================================================================
// Notifications Endpoints
// ==================================================================================

/**
 * @description Notification channels endpoint.
 * @method GET, POST
 */
export const NOTIFICATION_CHANNELS_URL = `${BASE_URL}/api/v1/notifications/channels/`;

/**
 * @description Notification templates endpoint.
 * @method GET, POST
 */
export const NOTIFICATION_TEMPLATES_URL = `${BASE_URL}/api/v1/notifications/templates/`;

/**
 * @description Notification rules endpoint.
 * @method GET, POST
 */
export const NOTIFICATION_RULES_URL = `${BASE_URL}/api/v1/notifications/rules/`;

/**
 * @description Notifications endpoint.
 * @method GET, POST
 */
export const NOTIFICATIONS_URL = `${BASE_URL}/api/v1/notifications/notifications/`;

/**
 * @description Notification preferences endpoint.
 * @method GET, POST
 */
export const NOTIFICATION_PREFERENCES_URL = `${BASE_URL}/api/v1/notifications/preferences/`;

/**
 * @description Notification digests endpoint.
 * @method GET, POST
 */
export const NOTIFICATION_DIGESTS_URL = `${BASE_URL}/api/v1/notifications/digests/`;

// ==================================================================================
// Staff Endpoints
// ==================================================================================

/**
 * @description Departments endpoint.
 * @method GET, POST
 */
export const DEPARTMENTS_URL = `${BASE_URL}/api/v1/staff/departments/`;

/**
 * @description Staff schedules endpoint.
 * @method GET, POST
 */
export const STAFF_SCHEDULES_URL = `${BASE_URL}/api/v1/staff/schedules/`;

/**
 * @description Work logs endpoint.
 * @method GET, POST
 */
export const WORK_LOGS_URL = `${BASE_URL}/api/v1/staff/work-logs/`;

/**
 * @description Staff assignments endpoint.
 * @method GET, POST
 */
export const STAFF_ASSIGNMENTS_URL = `${BASE_URL}/api/v1/staff/assignments/`;

/**
 * @description Staff performance metrics endpoint.
 * @method GET
 */
export const STAFF_PERFORMANCE_METRICS_URL = `${BASE_URL}/api/v1/staff/performance-metrics/`;

/**
 * @description Bulk actions endpoint.
 * @method POST
 */
export const BULK_ACTIONS_URL = `${BASE_URL}/api/v1/staff/bulk-actions/`;

/**
 * @description Reports endpoint.
 * @method GET
 */
export const REPORTS_URL = `${BASE_URL}/api/v1/staff/reports/`;
