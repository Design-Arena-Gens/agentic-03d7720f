'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Editor from '@/components/Editor';
import { Page } from '@/types';

export default function Home() {
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('notion-pages');
    if (stored) {
      const parsedPages = JSON.parse(stored);
      setPages(parsedPages);
      if (parsedPages.length > 0) {
        setCurrentPage(parsedPages[0]);
      }
    } else {
      const defaultPage: Page = {
        id: '1',
        title: 'Getting Started',
        content: [
          { id: '1', type: 'heading1', content: 'Welcome to Notion Clone' },
          { id: '2', type: 'paragraph', content: 'This is a fully functional Notion clone built with Next.js.' },
          { id: '3', type: 'heading2', content: 'Features' },
          { id: '4', type: 'bulletList', content: 'Multiple page types: headings, paragraphs, lists, quotes' },
          { id: '5', type: 'bulletList', content: 'Create and organize pages in a sidebar' },
          { id: '6', type: 'bulletList', content: 'Rich text editing with keyboard shortcuts' },
          { id: '7', type: 'bulletList', content: 'Persistent storage using localStorage' },
          { id: '8', type: 'heading2', content: 'How to Use' },
          { id: '9', type: 'paragraph', content: 'Type "/" to see block options. Use # for headings, - for bullets.' },
        ],
        icon: '📚',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setPages([defaultPage]);
      setCurrentPage(defaultPage);
    }
  }, []);

  useEffect(() => {
    if (pages.length > 0) {
      localStorage.setItem('notion-pages', JSON.stringify(pages));
    }
  }, [pages]);

  const createNewPage = () => {
    const newPage: Page = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: [],
      icon: '📄',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setPages([...pages, newPage]);
    setCurrentPage(newPage);
  };

  const deletePage = (pageId: string) => {
    const updatedPages = pages.filter(p => p.id !== pageId);
    setPages(updatedPages);
    if (currentPage?.id === pageId) {
      setCurrentPage(updatedPages[0] || null);
    }
  };

  const updatePage = (updatedPage: Page) => {
    const updatedPages = pages.map(p =>
      p.id === updatedPage.id ? { ...updatedPage, updatedAt: new Date().toISOString() } : p
    );
    setPages(updatedPages);
    setCurrentPage(updatedPage);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        pages={pages}
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        onCreatePage={createNewPage}
        onDeletePage={deletePage}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 overflow-hidden">
        {currentPage ? (
          <Editor
            page={currentPage}
            onUpdate={updatePage}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Create a new page to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
