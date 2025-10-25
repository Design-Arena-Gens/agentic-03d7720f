'use client';

import { Page } from '@/types';
import { Plus, FileText, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  pages: Page[];
  currentPage: Page | null;
  onSelectPage: (page: Page) => void;
  onCreatePage: () => void;
  onDeletePage: (pageId: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  pages,
  currentPage,
  onSelectPage,
  onCreatePage,
  onDeletePage,
  isOpen,
  onToggle,
}: SidebarProps) {
  return (
    <>
      <aside
        className={clsx(
          'bg-gray-50 border-r border-gray-200 flex flex-col transition-all duration-300',
          isOpen ? 'w-64' : 'w-0'
        )}
      >
        {isOpen && (
          <>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-semibold text-gray-800">Workspace</h1>
                <button
                  onClick={onToggle}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              <button
                onClick={onCreatePage}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>New Page</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              <div className="space-y-1">
                {pages.map((page) => (
                  <div
                    key={page.id}
                    className={clsx(
                      'group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer transition-colors',
                      currentPage?.id === page.id
                        ? 'bg-gray-200 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-200'
                    )}
                    onClick={() => onSelectPage(page)}
                  >
                    <span className="text-lg">{page.icon}</span>
                    <FileText className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1 text-sm truncate">{page.title}</span>
                    {pages.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePage(page.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-300 rounded"
                      >
                        <Trash2 className="w-3 h-3 text-red-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </aside>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="absolute top-4 left-4 p-2 bg-white border border-gray-200 rounded-md hover:bg-gray-50 z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </>
  );
}
