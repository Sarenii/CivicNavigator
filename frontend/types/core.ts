/**
 * Base interface for models with common timestamp fields.
 */
export interface TimestampedModel {
  id: string; // UUID
  created_at: string;
  updated_at: string;
}

/**
 * Mixin interface for models that track creation and update users.
 */
export interface AuditMixin {
  created_by?: number; // User ID
  updated_by?: number; // User ID
}

/**
 * Mixin interface for models that support soft deletion.
 */
export interface SoftDeleteMixin {
  is_deleted: boolean;
  deleted_at?: string;
  deleted_by?: number; // User ID
}

/**
 * Base model interface combining timestamping, auditing, and soft deletion.
 */
export interface BaseModel extends TimestampedModel, AuditMixin, SoftDeleteMixin {}