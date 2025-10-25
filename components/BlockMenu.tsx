'use client';

import { useEffect, useRef } from 'react';
import { BlockType } from '@/types';
import { Type, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code } from 'lucide-react';

interface BlockMenuProps {
  position: { top: number; left: number };
  onSelect: (type: BlockType) => void;
  onClose: () => void;
}

interface MenuItem {
  type: BlockType;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function BlockMenu({ position, onSelect, onClose }: BlockMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    {
      type: 'paragraph',
      label: 'Text',
      icon: <Type className="w-4 h-4" />,
      description: 'Plain text paragraph',
    },
    {
      type: 'heading1',
      label: 'Heading 1',
      icon: <Heading1 className="w-4 h-4" />,
      description: 'Large section heading',
    },
    {
      type: 'heading2',
      label: 'Heading 2',
      icon: <Heading2 className="w-4 h-4" />,
      description: 'Medium section heading',
    },
    {
      type: 'heading3',
      label: 'Heading 3',
      icon: <Heading3 className="w-4 h-4" />,
      description: 'Small section heading',
    },
    {
      type: 'bulletList',
      label: 'Bulleted List',
      icon: <List className="w-4 h-4" />,
      description: 'Create a bullet list',
    },
    {
      type: 'numberedList',
      label: 'Numbered List',
      icon: <ListOrdered className="w-4 h-4" />,
      description: 'Create a numbered list',
    },
    {
      type: 'quote',
      label: 'Quote',
      icon: <Quote className="w-4 h-4" />,
      description: 'Capture a quotation',
    },
    {
      type: 'code',
      label: 'Code',
      icon: <Code className="w-4 h-4" />,
      description: 'Code snippet',
    },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-50 w-72"
      style={{ top: position.top + 4, left: position.left }}
    >
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.type}
            onClick={() => onSelect(item.type)}
            className="w-full flex items-start gap-3 px-3 py-2 rounded hover:bg-gray-100 transition-colors text-left"
          >
            <div className="mt-0.5 text-gray-600">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-500">{item.description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
