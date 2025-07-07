
import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface ArticleFormProps {
    onSubmit: (articleData: Omit<Article, 'id' | 'created_at'>) => void;
    onClose: () => void;
    initialData?: Article | null;
    error?: string | null;
    isSubmitting?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, onClose, initialData, error, isSubmitting }) => {
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [author, setAuthor] = useState('F1 Replay Staff');
    const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0]);
    const [imageUrl, setImageUrl] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setSlug(initialData.slug);
            setAuthor(initialData.author);
            setPublishedAt(initialData.published_at);
            setImageUrl(initialData.image_url);
            setExcerpt(initialData.excerpt);
            setContent(initialData.content);
        }
    }, [initialData]);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    }
    
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        if (!initialData?.slug) { // Only auto-generate slug for new articles or if slug is empty
           setSlug(generateSlug(newTitle));
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            title,
            slug,
            author,
            published_at: publishedAt,
            image_url: imageUrl,
            excerpt,
            content
        });
    };

    const formFields = [
        { id: 'title', label: 'Title', type: 'text', value: title, onChange: handleTitleChange },
        { id: 'slug', label: 'URL Slug', type: 'text', value: slug, onChange: (e) => setSlug(e.target.value) },
        { id: 'author', label: 'Author', type: 'text', value: author, onChange: (e) => setAuthor(e.target.value) },
        { id: 'published_at', label: 'Publish Date', type: 'date', value: publishedAt, onChange: (e) => setPublishedAt(e.target.value) },
        { id: 'image_url', label: 'Image URL', type: 'url', value: imageUrl, onChange: (e) => setImageUrl(e.target.value) },
        { id: 'excerpt', label: 'Excerpt', type: 'textarea', value: excerpt, onChange: (e) => setExcerpt(e.target.value), rows: 3 },
        { id: 'content', label: 'Content', type: 'textarea', value: content, onChange: (e) => setContent(e.target.value), rows: 10 },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
                <div className="bg-red-900/50 border border-f1-red text-red-200 p-3 rounded-md text-sm whitespace-pre-wrap font-mono">
                    <p className="font-bold mb-2">Error Saving Article:</p>
                    {error}
                </div>
            )}
             <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input type="text" id="title" value={title} onChange={handleTitleChange} className="form-input mt-1 block w-full" required disabled={isSubmitting} />
            </div>
            <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-1">URL Slug</label>
                <input type="text" id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} className="form-input mt-1 block w-full" required disabled={isSubmitting} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-300 mb-1">Author</label>
                    <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="form-input mt-1 block w-full" required disabled={isSubmitting} />
                </div>
                <div>
                    <label htmlFor="published_at" className="block text-sm font-medium text-gray-300 mb-1">Publish Date</label>
                    <input type="date" id="published_at" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} className="form-input mt-1 block w-full" required disabled={isSubmitting} />
                </div>
            </div>
             <div>
                <label htmlFor="image_url" className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                <input type="url" id="image_url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="form-input mt-1 block w-full" required disabled={isSubmitting} />
            </div>
             <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-300 mb-1">Excerpt</label>
                <textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="form-textarea mt-1 block w-full" required disabled={isSubmitting}></textarea>
            </div>
             <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">Content</label>
                <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="form-textarea mt-1 block w-full" required disabled={isSubmitting}></textarea>
            </div>
            <div className="flex justify-end pt-4 space-x-3">
                 <button type="button" onClick={onClose} disabled={isSubmitting} className="inline-flex items-center justify-center px-4 py-2 border border-f1-gray text-base font-bold rounded-md text-gray-300 bg-transparent hover:bg-f1-gray disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-bold rounded-md shadow-lg text-white bg-f1-red hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Article' : 'Add Article')}
                </button>
            </div>
        </form>
    );
};

export default ArticleForm;
