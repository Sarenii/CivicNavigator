// app/components/staff/kb/KBArticleList.tsx

import React from 'react'
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'
import { KnowledgeArticleSummary } from '../../../../types'

interface KBArticleListProps {
  articles: KnowledgeArticleSummary[];
  onEdit: (articleId: number) => void;
  onDelete: (articleId: number, title: string) => void;
}

const Badge = ({ children, color }: { children: React.ReactNode; color: 'blue' | 'gray' | 'green' | 'yellow' | 'red' | 'indigo' }) => {
  const map = {
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    indigo: 'bg-indigo-100 text-indigo-800',
  } as const
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${map[color]}`}>{children}</span>
}

const statusColor = (status: string): 'gray' | 'yellow' | 'green' | 'red' => {
  switch (status) {
    case 'draft':
      return 'gray'
    case 'review':
      return 'yellow'
    case 'published':
      return 'green'
    case 'archived':
      return 'red'
    default:
      return 'gray'
  }
}

export default function KBArticleList({ articles, onEdit, onDelete }: KBArticleListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900">{article.title}</div>
                  {article.excerpt && (
                    <div className="text-gray-500 text-xs truncate max-w-xl">{article.excerpt}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-700">{article.category_name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge color="indigo">{article.article_type}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge color={statusColor(article.status)}>{article.status}</Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {article.published_at ? new Date(article.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  }) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right font-medium">
                  <div className="flex items-center justify-end space-x-4">
                    <button
                      onClick={() => onEdit(article.id)}
                      className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                    >
                      <PencilSquareIcon className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(article.id, article.title)}
                      className="text-red-600 hover:text-red-900 transition-colors flex items-center gap-1"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}