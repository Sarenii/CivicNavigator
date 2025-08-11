// app/components/staff/kb/KBManagement.tsx

'use client'
import React, { useMemo, useState } from 'react'
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import KBArticleList from './KBArticleList'
import KBArticleForm from './KBArticleForm'
import { KnowledgeArticle, KnowledgeArticleCreateData, KnowledgeArticleSummary, KnowledgeCategory } from '../../../../types'
import ApiService from '../../../../handler/ApiService'
import { useApi } from '../../../hooks/useApi'
import { toast } from 'sonner'

export default function KBManagement() {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)

  const ARTICLES_URL = ApiService.KNOWLEDGE_ARTICLES_URL
  const CATEGORIES_URL = ApiService.KNOWLEDGE_CATEGORIES_URL

  const { useFetchData: useFetchArticles, useFetchById: useFetchArticleById, useAddItem, useUpdateItem, useDeleteItem } = useApi<KnowledgeArticleSummary, KnowledgeArticle>(ARTICLES_URL, 10)
  const { useFetchData: useFetchCategories } = useApi<KnowledgeCategory, KnowledgeCategory>(CATEGORIES_URL, 100)

  const [page, setPage] = useState(1)
  const { data: articlesPage, isLoading: isArticlesLoading } = useFetchArticles(page)
  const summaries = useMemo(() => articlesPage?.results ?? [], [articlesPage])

  const { data: categoriesPage } = useFetchCategories(1)
  const categories = useMemo(() => categoriesPage?.results ?? [], [categoriesPage])

  const { data: articleDetail } = useFetchArticleById(editingId ?? '', {})

  const addMutation = useAddItem
  const updateMutation = useUpdateItem
  const deleteMutation = useDeleteItem

  const handleShowAddForm = () => {
    setEditingId(null)
    setView('form')
  }

  const handleShowEditForm = (articleId: number) => {
    setEditingId(articleId)
    setView('form')
  }

  const handleCancelForm = () => {
    setView('list')
    setEditingId(null)
  }

  const handleSaveArticle = async (payload: KnowledgeArticleCreateData | FormData, id?: number) => {
    try {
      if (id) {
        await updateMutation.mutateAsync({ id, item: payload as any })
        toast.success('Article updated')
      } else {
        if (payload instanceof FormData) {
          await addMutation.mutateAsync(payload)
        } else {
          await addMutation.mutateAsync({ item: payload })
        }
        toast.success('Article created')
      }
      setView('list')
      setEditingId(null)
    } catch (error) {
      // handled globally by interceptor toast helper
    }
  }

  const handleDelete = async (articleId: number, title: string) => {
    if (!confirm(`Delete article "${title}"?`)) return
    try {
      await deleteMutation.mutateAsync({ id: articleId })
      toast.success('Article deleted')
    } catch (error) {
      // handled globally
    }
  }

  const handleReindex = () => {
    toast.info('Re-index requested (placeholder).')
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Knowledge Base Articles</h3>
          <p className="text-gray-600">Create, edit, and manage help articles.</p>
        </div>
        {view === 'list' && (
          <div className="flex space-x-3">
            <button onClick={handleReindex} className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors">
              <ArrowPathIcon className="w-5 h-5" />
              Re-index KB
            </button>
            <button onClick={handleShowAddForm} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors">
              <PlusIcon className="w-5 h-5" />
              Add New Article
            </button>
          </div>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          <KBArticleList articles={summaries} onEdit={handleShowEditForm} onDelete={handleDelete} />
          <div className="flex items-center justify-between">
            <button disabled={page === 1 || isArticlesLoading} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1.5 rounded border disabled:opacity-50">Previous</button>
            <div className="text-sm text-gray-600">Page {page}</div>
            <button disabled={!articlesPage?.next || isArticlesLoading} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded border disabled:opacity-50">Next</button>
          </div>
        </div>
      ) : (
        <KBArticleForm onSave={handleSaveArticle} onCancel={handleCancelForm} articleToEdit={articleDetail ?? null} categories={categories} isSaving={addMutation.isPending || updateMutation.isPending} />
      )}
    </div>
  )
}