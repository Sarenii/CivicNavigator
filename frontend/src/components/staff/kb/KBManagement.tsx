// app/components/staff/kb/KBManagement.tsx

'use client'
import React, { useState } from 'react'
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import KBArticleList from './KBArticleList'
import KBArticleForm from './KBArticleForm' // <-- New form import
import { KBArticle, KBArticlePayload } from '../../../../types'

// Dummy data remains the same
const dummyArticles: KBArticle[] = [
  {
    id: 'kb-001',
    title: 'How to Report a Broken Streetlight',
    body: 'To report a broken streetlight, please use the incident reporting form and select the "Public Lighting" category. Provide the pole number if possible.',
    tags: ['incidents', 'lighting', 'reporting'],
    source: 'https://city.gov/services/report-streetlight',
    last_updated: '2025-08-01T10:00:00Z',
  },
  {
    id: 'kb-002',
    title: 'Garbage Collection Schedule for South C',
    body: 'Garbage in South C is collected on Mondays and Thursdays between 8 AM and 4 PM. Please place your bins on the curb by 7 AM.',
    tags: ['waste', 'schedule', 'services'],
    source: 'https://city.gov/services/waste-collection',
    last_updated: '2025-07-28T14:30:00Z',
  },
  // ... other articles
];

export default function KBManagement() {
  // State to control which view is active: 'list' or 'form'
  const [view, setView] = useState<'list' | 'form'>('list');
  const [articleToEdit, setArticleToEdit] = useState<KBArticle | null>(null);

  const handleShowAddForm = () => {
    setArticleToEdit(null); // Clear any article being edited
    setView('form');
  };

  const handleShowEditForm = (article: KBArticle) => {
    setArticleToEdit(article);
    setView('form');
  };

  const handleCancelForm = () => {
    setView('list');
    setArticleToEdit(null); // Clean up
  };

  const handleSaveArticle = (articleData: KBArticlePayload) => {
    if (articleToEdit) {
      alert(`UPDATING ARTICLE:\n${JSON.stringify(articleData, null, 2)}`);
    } else {
      alert(`CREATING NEW ARTICLE:\n${JSON.stringify(articleData, null, 2)}`);
    }
    setView('list'); // Return to the list view after saving
  };

  const handleDelete = (article: KBArticle) => {
    if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
      alert(`DELETING: ${article.title}`);
    }
  };

  const handleReindex = () => {
    alert('Re-indexing knowledge base...');
  };

  return (
    <div className="p-8">
      {/* Header and Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Knowledge Base Articles</h3>
          <p className="text-gray-600">Create, edit, and manage help articles.</p>
        </div>
        {/* Only show Add/Re-index buttons when in the list view */}
        {view === 'list' && (
          <div className="flex space-x-3">
            <button
              onClick={handleReindex}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
              Re-index KB
            </button>
            <button
              onClick={handleShowAddForm}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add New Article
            </button>
          </div>
        )}
      </div>

      {/* Conditional Rendering: Show either the list or the form */}
      {view === 'list' ? (
        <KBArticleList 
          articles={dummyArticles}
          onEdit={handleShowEditForm}
          onDelete={handleDelete}
        />
      ) : (
        <KBArticleForm 
          onSave={handleSaveArticle}
          onCancel={handleCancelForm}
          articleToEdit={articleToEdit}
        />
      )}
    </div>
  );
}