// app/components/staff/kb/KBArticleForm.tsx

'use client'
import { useEffect, useMemo, useState } from 'react'
import { KnowledgeArticle, KnowledgeCategory } from '../../../../types'
import { 
  DocumentTextIcon, 
  TagIcon, 
  StarIcon,
  EyeIcon,
  LockClosedIcon,
  PaperClipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface KBArticleFormProps {
  onSave: (payload: Partial<KnowledgeArticle> | FormData, id?: number) => void | Promise<void>;
  onCancel: () => void;
  articleToEdit: KnowledgeArticle | null;
  categories: KnowledgeCategory[];
  isSaving?: boolean;
  mode: 'edit' | 'create';
}

export default function KBArticleForm({ 
  onSave, 
  onCancel, 
  articleToEdit, 
  categories, 
  isSaving, 
  mode 
}: KBArticleFormProps) {
  const [formError, setFormError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<string>('')
  const [articleType, setArticleType] = useState('faq')
  const [status, setStatus] = useState('draft')
  const [metaDescription, setMetaDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [requiresStaffAccess, setRequiresStaffAccess] = useState(false)
  const [attachments, setAttachments] = useState<FileList | null>(null)

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title)
      setExcerpt(articleToEdit.excerpt || '')
      setContent(articleToEdit.content)
      setCategory(
        typeof articleToEdit.category === 'object' && articleToEdit.category !== null && 'id' in articleToEdit.category
          ? String((articleToEdit.category as KnowledgeCategory).id)
          : ''
      )
      setArticleType(articleToEdit.article_type)
      setStatus(articleToEdit.status)
      setMetaDescription(articleToEdit.meta_description || '')
      setKeywords(articleToEdit.keywords || '')
      setIsFeatured(articleToEdit.is_featured)
      setIsPublic(articleToEdit.is_public)
      setRequiresStaffAccess(articleToEdit.requires_staff_access)
      setAttachments(null)
    }
  }, [articleToEdit])

  const categoryOptions = useMemo(() => {
    return categories
      .filter(c => c.is_active)
      .sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name))
  }, [categories])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments(e.target.files)
  }

  const handleSave = () => {
    if (!title || !content) {
      setFormError('Title and content are required.')
      return
    }
    if (category === '') {
      setFormError('Please select a category.')
      return
    }
    
    setFormError(null)
    
    
    const basePayload: Partial<KnowledgeArticle> = {
      title,
      excerpt: excerpt || undefined,
      content,
      category: category,
      article_type: articleType,
      status,
      meta_description: metaDescription || undefined,
      keywords: keywords || undefined,
      is_featured: isFeatured,
      is_public: isPublic,
      requires_staff_access: requiresStaffAccess,
    }

    if (attachments && attachments.length > 0) {
      const form = new FormData()
      Object.entries(basePayload).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'category' && value && typeof value === 'object') {
            form.append('category', String((value as KnowledgeCategory).id))
          } else {
            form.append(key, String(value))
          }
        }
      })
      Array.from(attachments).forEach(file => form.append('uploaded_attachments', file))
      onSave(form as unknown as Partial<KnowledgeArticle>, articleToEdit?.id)
    } else {
      onSave(basePayload, articleToEdit?.id)
    }
  }

  const inputClasses = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700'
  const textareaClasses = 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-700'

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {mode === 'edit' ? 'Edit Article' : 'Create Article'}
                </h1>
                <p className="text-gray-600">
                  {mode === 'edit' ? 'Update your article content' : 'Create a new knowledge base article'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {formError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{formError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClasses}
                  placeholder="Enter article title..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="">Select category</option>
                    {categoryOptions.map(c => (
                      <option key={c.id} value={String(c.id)}>
                        {c.full_path || c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Type
                  </label>
                  <select
                    value={articleType}
                    onChange={(e) => setArticleType(e.target.value)}
                    className={inputClasses}
                  >
                    <option value="faq">FAQ</option>
                    <option value="guide">Guide</option>
                    <option value="procedure">Procedure</option>
                    <option value="policy">Policy</option>
                    <option value="announcement">Announcement</option>
                    <option value="troubleshooting">Troubleshooting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Excerpt
                </label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className={textareaClasses}
                  placeholder="Brief summary for article previews..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Content *
                </label>
                <textarea
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={textareaClasses}
                  placeholder="Write your article content here..."
                />
                <p className="mt-1 text-sm text-gray-700">Markdown formatting supported</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={inputClasses}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Under Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <StarIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Featured Article</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Public Access</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={requiresStaffAccess}
                    onChange={(e) => setRequiresStaffAccess(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                  <LockClosedIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Staff Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* SEO & Attachments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className={textareaClasses}
                    placeholder="SEO description..."
                    maxLength={160}
                  />
                  <div className="flex justify-between text-sm text-gray-700 mt-1">
                    <span>For search engines</span>
                    <span>{metaDescription.length}/160</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className={inputClasses}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h2>
              <div>
                <input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="attachments"
                  className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <PaperClipIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 font-medium">Upload Files</p>
                  <p className="text-sm text-gray-700">PDF, images, documents</p>
                </label>
              </div>
              {attachments && attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {Array.from(attachments).map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm bg-gray-50 rounded p-2">
                      <PaperClipIcon className="w-4 h-4 text-gray-400" />
                      <span className="truncate">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={isSaving}
              className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Save Article
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}