// app/components/staff/kb/KBArticleForm.tsx

'use client'
import { useState, useEffect } from 'react'
import { KBArticle, KBArticlePayload } from '../../../../types'

interface KBArticleFormProps {
  onSave: (article: KBArticlePayload) => void;
  onCancel: () => void;
  articleToEdit: KBArticle | null;
}

export default function KBArticleForm({ onSave, onCancel, articleToEdit }: KBArticleFormProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [source, setSource] = useState('');

  // CORRECTED: These classes make the border explicit and always visible.
  const inputClasses = "block w-full rounded-xl border border-gray-300 bg-white py-3 px-4 text-base placeholder:text-gray-400 shadow-sm transition duration-150 ease-in-out focus:border-blue-600 focus:ring-2 focus:ring-blue-200";

  useEffect(() => {
    if (articleToEdit) {
      setTitle(articleToEdit.title);
      setBody(articleToEdit.body);
      setTags(articleToEdit.tags.join(', '));
      setSource(articleToEdit.source);
    } else {
      // Reset for new article form
      setTitle('');
      setBody('');
      setTags('');
      setSource('');
    }
  }, [articleToEdit]);

  const handleSave = () => {
    if (!title || !body) {
      alert('Title and Body are required.');
      return;
    }

    const articleData: KBArticlePayload = {
      id: articleToEdit?.id,
      title,
      body,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      source,
    };
    onSave(articleData);
  };

  const formTitle = articleToEdit ? 'Edit Article' : 'Add New Article';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
      {/* Form Header */}
      <div className="mb-8">
        <h4 className="text-2xl font-bold text-gray-900">{formTitle}</h4>
        <p className="text-gray-500">Fill in the details for the knowledge base article below.</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClasses}
          />
        </div>
        <div>
          <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">Body</label>
          <textarea
            id="body"
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={inputClasses}
            placeholder="Article content. You can use Markdown for formatting."
          />
        </div>
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className={inputClasses}
            placeholder="e.g. waste, schedule, services"
          />
          <p className="mt-2 text-xs text-gray-500">Enter tags separated by commas.</p>
        </div>
        <div>
          <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">Source URL (Optional)</label>
          <input
            type="url"
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={inputClasses}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          className="px-6 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-6 py-2.5 rounded-lg bg-blue-600 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          onClick={handleSave}
        >
          Save Article
        </button>
      </div>
    </div>
  )
}