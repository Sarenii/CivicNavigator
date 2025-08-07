/**
 * Represents a knowledge category.
 */
export interface KnowledgeCategory {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  slug: string;
  parent?: number;
  children: KnowledgeCategory[];
  display_order: number;
  is_active: boolean;
  is_public: boolean;
  full_path: string;
  article_count: number;
}

/**
 * Represents an attachment to a knowledge article.
 */
export interface KnowledgeAttachment {
  id: number;
  file: string;
  file_url: string;
  title: string;
  description?: string;
  file_size: number;
  download_count: number;
  created_at: string;
}

/**
 * Represents a rating for a knowledge article.
 */
export interface KnowledgeRating {
  id: number;
  is_helpful: boolean;
  feedback?: string;
  created_at: string;
}

/**
 * Represents a comment on a knowledge article.
 */
export interface KnowledgeComment {
  id: number;
  author?: number;
  author_name: string;
  content: string;
  parent?: number;
  is_approved: boolean;
  is_staff_comment: boolean;
  replies: KnowledgeComment[];
  created_at: string;
}

/**
 * Represents a summary of a knowledge article for list views.
 */
export interface KnowledgeArticleSummary {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  category_name: string;
  article_type: string;
  status: string;
  author_name: string;
  published_at?: string;
  view_count: number;
  helpfulness_ratio: number;
  is_featured: boolean;
  last_reviewed_at?: string;
  is_review_due: boolean;
}

/**
 * Represents a detailed view of a knowledge article.
 */
export interface KnowledgeArticle {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  category: KnowledgeCategory;
  attachments: KnowledgeAttachment[];
  comments: KnowledgeComment[];
  article_type: string;
  status: string;
  published_at?: string;
  author_name: string;
  reviewed_by_name?: string;
  reviewed_at?: string;
  version: number;
  meta_description?: string;
  keywords?: string;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  helpfulness_ratio: number;
  is_featured: boolean;
  is_public: boolean;
  requires_staff_access: boolean;
  last_reviewed_at?: string;
  review_due_date?: string;
  is_review_due: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Represents data for creating a knowledge article.
 */
export interface KnowledgeArticleCreateData {
  title: string;
  excerpt?: string;
  content: string;
  category: number;
  article_type: string;
  status: string;
  meta_description?: string;
  keywords?: string;
  is_featured: boolean;
  is_public: boolean;
  requires_staff_access: boolean;
  uploaded_attachments?: File[];
}

/**
 * Represents a Frequently Asked Question (FAQ).
 */
export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category?: number;
  category_name?: string;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  view_count: number;
  helpful_votes: number;
  not_helpful_votes: number;
  helpfulness_ratio: number;
  keywords?: string;
  created_at: string;
  updated_at: string;
}