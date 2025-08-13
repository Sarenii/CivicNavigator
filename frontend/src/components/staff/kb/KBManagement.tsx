// app/components/staff/kb/KBManagement.tsx

'use client'
import React, { useMemo, useState } from 'react'
import { 
  PlusIcon, 
  BookOpenIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import KBArticleList from './KBArticleList'
import KBArticleForm from './KBArticleForm'
import { KnowledgeArticle, KnowledgeArticleSummary, KnowledgeCategory } from '../../../../types'
import ApiService from '../../../../handler/ApiService'
import { useApi } from '../../../hooks/useApi'
import { toast } from 'sonner'
import { handleApiError } from '@/hooks/useApiErrorHandler'

export default function KBManagement() {
  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [page, setPage] = useState(1)

  const ARTICLES_URL = ApiService.KNOWLEDGE_ARTICLES_URL
  const CATEGORIES_URL = ApiService.KNOWLEDGE_CATEGORIES_URL

  const { 
    useFetchData: useFetchArticles, 
    useFetchById: useFetchArticleById, 
    useAddItem, 
    useUpdateItem, 
    useDeleteItem 
  } = useApi<KnowledgeArticleSummary, KnowledgeArticle>(ARTICLES_URL, 10)
  
  const { useFetchData: useFetchCategories } = useApi<KnowledgeCategory, KnowledgeCategory>(CATEGORIES_URL, 100)

  const { data: articlesPage, isLoading, refetch: refetchArticle } = useFetchArticles(page)
  const { data: categoriesPage } = useFetchCategories(1)
  const { data: articleDetail } = useFetchArticleById(editingId ?? '', {})

  const articles = useMemo(() => articlesPage?.results ?? [], [articlesPage,articlesPage?.results])
  const categories = useMemo(() => categoriesPage?.results ?? [], [categoriesPage])

  // Stats
  const stats = useMemo(() => {
    const total = articles.length
    const published = articles.filter(a => a.status === 'published').length
    const drafts = articles.filter(a => a.status === 'draft').length
    return { total, published, drafts }
  }, [articles])

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

  const handleSaveArticle = async (payload: Partial<KnowledgeArticle> | FormData, id?: number) => {
    try {
      if (id) {
        await useUpdateItem.mutateAsync({ id, item: payload as any },{
          onSuccess(data, variables, context) {
            // Handle success
            toast.success('Article updated!')
            refetchArticle()
          },
          onError(error, variables, context) {
            // Handle error
            toast.error('Failed to update article.')
            handleApiError(error)

          }
        })
      } else {
        await useAddItem.mutateAsync({ item: payload },{
          onSuccess(data, variables, context) {
            // Handle success
            toast.success('Article created!')
            refetchArticle()
          },
          onError(error, variables, context) {
            // Handle error
            toast.error('Failed to create article.')
            handleApiError(error)

          }
        })
      }
      setView('list')
      setEditingId(null)
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const handleDelete = async (articleId: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    
    try {
      await useDeleteItem.mutateAsync({ id: articleId },{
        onSuccess(data, variables, context) {
          toast.success('Article deleted')
          refetchArticle()
        },
        onError(error, variables, context) {
          toast.error('Failed to delete article.')
          handleApiError(error)
        }
      })
    } catch (error) {
      console.error('Delete error:', error)
    }
  }

  const handleReindex = () => {
    toast.info('Re-indexing knowledge base...')
  }

  if (view === 'form') {
    return (
      <KBArticleForm
        onSave={handleSaveArticle}
        onCancel={handleCancelForm}
        articleToEdit={articleDetail ?? null}
        categories={categories}
        isSaving={useAddItem.isPending || useUpdateItem.isPending}
        mode={editingId ? 'edit' : 'create'}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpenIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Knowledge Base</h1>
              <p className="text-gray-600">Manage articles and documentation</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats.published}</div>
              <div className="text-sm text-gray-600">Published</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{stats.drafts}</div>
              <div className="text-sm text-gray-600">Drafts</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleShowAddForm}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Article
            </button>
            <button
              onClick={handleReindex}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Re-index
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Articles Yet</h3>
            <p className="text-gray-600 mb-6">Create your first knowledge base article</p>
            <button
              onClick={handleShowAddForm}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Article
            </button>
          </div>
        ) : (
          <>
            <KBArticleList 
              articles={articles} 
              onEdit={handleShowEditForm} 
              onDelete={handleDelete} 
            />

            {/* Pagination */}
            {articlesPage && (articlesPage.previous || articlesPage.next) && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">Page {page}</span>
                  <button
                    disabled={!articlesPage?.next}
                    onClick={() => setPage(p => p + 1)}
                    className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Quick Actions */}
        {/* <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center gap-3 p-4 text-left bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <EyeIcon className="w-8 h-8 text-green-600" />
              <div>
                <div className="font-medium text-green-900">View Public KB</div>
                <div className="text-sm text-green-600">Customer view</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 text-left bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <DocumentTextIcon className="w-8 h-8 text-purple-600" />
              <div>
                <div className="font-medium text-purple-900">Categories</div>
                <div className="text-sm text-purple-600">Organize content</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 text-left bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <BookOpenIcon className="w-8 h-8 text-orange-600" />
              <div>
                <div className="font-medium text-orange-900">Analytics</div>
                <div className="text-sm text-orange-600">View stats</div>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 text-left bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <BookOpenIcon className="w-8 h-8 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">Feedback</div>
                <div className="text-sm text-blue-600">User comments</div>
              </div>
            </button>
          </div>
        </div> */}
      </div>
    </div>
  )
}