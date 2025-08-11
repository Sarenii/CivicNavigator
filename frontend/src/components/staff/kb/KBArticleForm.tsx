// app/components/staff/kb/KBArticleForm.tsx

'use client'
import { useEffect, useMemo, useState } from 'react'
import { KnowledgeArticle, KnowledgeArticleCreateData, KnowledgeCategory } from '../../../../types'

interface KBArticleFormProps {
  onSave: (payload: KnowledgeArticleCreateData, id?: number) => void;
  onCancel: () => void;
  articleToEdit: KnowledgeArticle | null;
  categories: KnowledgeCategory[];
  isSaving?: boolean;
}

export default function KBArticleForm({ onSave, onCancel, articleToEdit, categories, isSaving }: KBArticleFormProps) {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<number | ''>('')
  const [articleType, setArticleType] = useState('faq')
  const [status, setStatus] = useState('draft')
  const [metaDescription, setMetaDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isPublic, setIsPublic] = useState(true)
  const [requiresStaffAccess, setRequiresStaffAccess] = useState(false)
  const [attachments, setAttachments] = useState<FileList | null>(null)

  const inputClasses = 'block w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-base placeholder:text-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-600 focus:ring-2 focus:ring-blue-200'

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title)
      setExcerpt(articleToEdit.excerpt || '')
      setContent(articleToEdit.content)
      setCategory(articleToEdit.category.id)
      setArticleType(articleToEdit.article_type)
      setStatus(articleToEdit.status)
      setMetaDescription(articleToEdit.meta_description || '')
      setKeywords(articleToEdit.keywords || '')
      setIsFeatured(articleToEdit.is_featured)
      setIsPublic(articleToEdit.is_public)
      setRequiresStaffAccess(articleToEdit.requires_staff_access)
      setAttachments(null)
    } else {
      setTitle('')
      setExcerpt('')
      setContent('')
      setCategory('')
      setArticleType('faq')
      setStatus('draft')
      setMetaDescription('')
      setKeywords('')
      setIsFeatured(false)
      setIsPublic(true)
      setRequiresStaffAccess(false)
      setAttachments(null)
    }
  }, [articleToEdit])

  const categoryOptions = useMemo(() => {
    return categories
      .filter((c) => c.is_active)
      .sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name))
  }, [categories])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAttachments(e.target.files)
  }

  const handleSave = () => {
    if (!title || !content || !category) return
    const basePayload: KnowledgeArticleCreateData = {
      title,
      excerpt: excerpt || undefined,
      content,
      category: Number(category),
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
        if (value !== undefined && value !== null) form.append(key, String(value))
      })
      Array.from(attachments).forEach((file) => form.append('uploaded_attachments', file))
      onSave(form as unknown as KnowledgeArticleCreateData, articleToEdit?.id)
    } else {
      onSave(basePayload, articleToEdit?.id)
    }
  }

  const formTitle = articleToEdit ? 'Edit Article' : 'Add New Article'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      <div className="mb-8">
        <h4 className="text-2xl font-bold text-gray-900">{formTitle}</h4>
        <p className="text-gray-500">Fill in article details. Attachments are optional.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className={inputClasses} />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
          <textarea id="excerpt" rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className={inputClasses} placeholder="Short summary shown in lists" />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Content</label>
          <textarea id="content" rows={12} value={content} onChange={(e) => setContent(e.target.value)} className={inputClasses} placeholder="Markdown supported" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value ? Number(e.target.value) : '')} className={inputClasses}>
              <option value="">Select category</option>
              {categoryOptions.map((c) => (
                <option key={c.id} value={c.id}>{c.full_path || c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">Article Type</label>
            <select id="type" value={articleType} onChange={(e) => setArticleType(e.target.value)} className={inputClasses}>
              <option value="faq">FAQ</option>
              <option value="guide">How-to Guide</option>
              <option value="procedure">Official Procedure</option>
              <option value="policy">Policy Document</option>
              <option value="announcement">Announcement</option>
              <option value="troubleshooting">Troubleshooting</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={inputClasses}>
              <option value="draft">Draft</option>
              <option value="review">Under Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div className="flex items-center gap-6 pt-7">
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              Public
            </label>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={requiresStaffAccess} onChange={(e) => setRequiresStaffAccess(e.target.checked)} />
              Staff-only
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="meta" className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
            <input id="meta" value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className={inputClasses} />
          </div>
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">Keywords (comma-separated)</label>
            <input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} className={inputClasses} placeholder="e.g. waste, schedule, services" />
          </div>
        </div>

        <div>
          <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
          <input id="attachments" type="file" multiple onChange={handleFileChange} className="block w-full text-sm text-gray-700" />
          <p className="mt-2 text-xs text-gray-500">PDF, Office docs, images are supported.</p>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end gap-3">
        <button type="button" className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors" onClick={onCancel} disabled={isSaving}>
          Cancel
        </button>
        <button type="button" className="px-6 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50" onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </div>
  )
}