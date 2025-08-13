// app/components/staff/kb/KBArticleList.tsx

import React from 'react'
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline'
import { KnowledgeArticleSummary } from '../../../../types'

interface KBArticleListProps {
  articles: KnowledgeArticleSummary[];
  onEdit: (articleId: number) => void;
  onDelete: (articleId: number, title: string) => void;
}

const StatusBadge = ({ status }: { status: string }) => {
  const colors = {
    draft: 'bg-gray-100 text-gray-800',
    review: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-red-100 text-red-800',
  } as const

  const color = colors[status as keyof typeof colors] || colors.draft

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${color}`}>
      {status}
    </span>
  )
}

const TypeBadge = ({ type }: { type: string }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
    {type}
  </span>
)

export default function KBArticleList({ articles, onEdit, onDelete }: KBArticleListProps) {
  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-700">No articles found</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    {article.is_featured && (
                      <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {article.title}
                      </div>
                      {article.excerpt && (
                        <div className="text-sm text-gray-700 truncate mt-1">
                          {article.excerpt}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {article.category_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TypeBadge type={article.article_type} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={article.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    <EyeIcon className="w-4 h-4" />
                    {article.view_count}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(article.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(article.id, article.title)}
                      className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {articles.map((article) => (
          <div key={article.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {article.is_featured && (
                  <div className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {article.title}
                  </h3>
                  {article.excerpt && (
                    <p className="text-xs text-gray-700 mt-1 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => onEdit(article.id)}
                  className="text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                >
                  <PencilSquareIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(article.id, article.title)}
                  className="text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-700">
              <div className="flex items-center gap-3">
                <span>{article.category_name}</span>
                <TypeBadge type={article.article_type} />
                <StatusBadge status={article.status} />
              </div>
              <div className="flex items-center gap-1">
                <EyeIcon className="w-3 h-3" />
                {article.view_count}
              </div>
            </div>

            {article.published_at && (
              <div className="text-xs text-gray-400 mt-2">
                Published {new Date(article.published_at).toLocaleDateString()}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}