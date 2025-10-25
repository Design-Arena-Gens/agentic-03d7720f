'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Page, Block, BlockType } from '@/types';
import BlockComponent from './BlockComponent';
import BlockMenu from './BlockMenu';

interface EditorProps {
  page: Page;
  onUpdate: (page: Page) => void;
}

export default function Editor({ page, onUpdate }: EditorProps) {
  const [title, setTitle] = useState(page.title);
  const [blocks, setBlocks] = useState<Block[]>(page.content);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setTitle(page.title);
    setBlocks(page.content);
  }, [page]);

  useEffect(() => {
    onUpdate({ ...page, title, content: blocks });
  }, [title, blocks]);

  const addBlock = (index: number, type: BlockType = 'paragraph') => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
    };
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setTimeout(() => {
      const element = document.getElementById(`block-${newBlock.id}`);
      if (element) element.focus();
    }, 0);
  };

  const updateBlock = (id: string, content: string, type?: BlockType) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content, ...(type && { type }) } : block
    ));
  };

  const deleteBlock = (id: string) => {
    const blockIndex = blocks.findIndex(b => b.id === id);
    if (blockIndex === -1) return;

    const newBlocks = blocks.filter(b => b.id !== id);
    setBlocks(newBlocks);

    setTimeout(() => {
      if (blockIndex > 0) {
        const prevBlock = newBlocks[blockIndex - 1];
        const element = document.getElementById(`block-${prevBlock.id}`);
        if (element) {
          element.focus();
          const range = document.createRange();
          const sel = window.getSelection();
          range.selectNodeContents(element);
          range.collapse(false);
          sel?.removeAllRanges();
          sel?.addRange(range);
        }
      } else if (newBlocks.length > 0) {
        const element = document.getElementById(`block-${newBlocks[0].id}`);
        if (element) element.focus();
      }
    }, 0);
  };

  const handleBlockKeyDown = (e: KeyboardEvent, blockId: string, content: string) => {
    const blockIndex = blocks.findIndex(b => b.id === blockId);

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(blockIndex);
    } else if (e.key === 'Backspace' && content === '') {
      e.preventDefault();
      if (blocks.length > 1 || blockIndex > 0) {
        deleteBlock(blockId);
      }
    } else if (e.key === 'ArrowUp' && blockIndex > 0) {
      const selection = window.getSelection();
      if (selection && selection.anchorOffset === 0) {
        e.preventDefault();
        const prevBlock = blocks[blockIndex - 1];
        const element = document.getElementById(`block-${prevBlock.id}`);
        if (element) element.focus();
      }
    } else if (e.key === 'ArrowDown' && blockIndex < blocks.length - 1) {
      const element = document.getElementById(`block-${blockId}`);
      const selection = window.getSelection();
      if (element && selection && selection.anchorOffset === element.textContent?.length) {
        e.preventDefault();
        const nextBlock = blocks[blockIndex + 1];
        const nextElement = document.getElementById(`block-${nextBlock.id}`);
        if (nextElement) nextElement.focus();
      }
    }
  };

  const handleBlockInput = (blockId: string, content: string) => {
    if (content.startsWith('/')) {
      const element = document.getElementById(`block-${blockId}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setMenuPosition({ top: rect.bottom, left: rect.left });
        setShowMenu(true);
        setActiveBlockId(blockId);
      }
    } else {
      setShowMenu(false);
    }

    let type: BlockType | undefined;
    let newContent = content;

    if (content.startsWith('# ')) {
      type = 'heading1';
      newContent = content.slice(2);
    } else if (content.startsWith('## ')) {
      type = 'heading2';
      newContent = content.slice(3);
    } else if (content.startsWith('### ')) {
      type = 'heading3';
      newContent = content.slice(4);
    } else if (content.startsWith('- ') || content.startsWith('* ')) {
      type = 'bulletList';
      newContent = content.slice(2);
    } else if (content.startsWith('1. ')) {
      type = 'numberedList';
      newContent = content.slice(3);
    } else if (content.startsWith('> ')) {
      type = 'quote';
      newContent = content.slice(2);
    } else if (content.startsWith('``` ')) {
      type = 'code';
      newContent = content.slice(4);
    }

    updateBlock(blockId, newContent, type);
  };

  const handleMenuSelect = (type: BlockType) => {
    if (activeBlockId) {
      updateBlock(activeBlockId, '', type);
      setShowMenu(false);
      setTimeout(() => {
        const element = document.getElementById(`block-${activeBlockId}`);
        if (element) element.focus();
      }, 0);
    }
  };

  if (blocks.length === 0) {
    addBlock(-1);
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-6xl">{page.icon}</span>
          </div>
          <textarea
            ref={titleRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="w-full text-5xl font-bold outline-none resize-none bg-transparent"
            rows={1}
            style={{ height: 'auto' }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = target.scrollHeight + 'px';
            }}
          />
        </div>

        <div className="space-y-1">
          {blocks.map((block, index) => (
            <BlockComponent
              key={block.id}
              block={block}
              onUpdate={handleBlockInput}
              onKeyDown={handleBlockKeyDown}
            />
          ))}
        </div>

        {blocks.length === 0 && (
          <div className="text-gray-400 text-sm mt-4">
            Type "/" for commands, or start typing...
          </div>
        )}
      </div>

      {showMenu && (
        <BlockMenu
          position={menuPosition}
          onSelect={handleMenuSelect}
          onClose={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}
