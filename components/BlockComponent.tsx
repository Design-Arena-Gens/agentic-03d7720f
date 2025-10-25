'use client';

import { KeyboardEvent } from 'react';
import { Block, BlockType } from '@/types';
import clsx from 'clsx';

interface BlockComponentProps {
  block: Block;
  onUpdate: (id: string, content: string) => void;
  onKeyDown: (e: KeyboardEvent, blockId: string, content: string) => void;
}

export default function BlockComponent({ block, onUpdate, onKeyDown }: BlockComponentProps) {
  const getBlockStyles = (type: BlockType) => {
    switch (type) {
      case 'heading1':
        return 'text-4xl font-bold mt-8 mb-2';
      case 'heading2':
        return 'text-3xl font-bold mt-6 mb-2';
      case 'heading3':
        return 'text-2xl font-bold mt-4 mb-2';
      case 'bulletList':
        return 'pl-6 relative before:content-["•"] before:absolute before:left-0 before:text-gray-400';
      case 'numberedList':
        return 'pl-6 relative before:content-["1."] before:absolute before:left-0 before:text-gray-400';
      case 'quote':
        return 'pl-4 border-l-4 border-gray-300 italic text-gray-700';
      case 'code':
        return 'font-mono bg-gray-100 p-4 rounded-md text-sm';
      default:
        return 'text-base';
    }
  };

  const getPlaceholder = (type: BlockType) => {
    switch (type) {
      case 'heading1':
        return 'Heading 1';
      case 'heading2':
        return 'Heading 2';
      case 'heading3':
        return 'Heading 3';
      case 'bulletList':
        return 'List item';
      case 'numberedList':
        return 'List item';
      case 'quote':
        return 'Quote';
      case 'code':
        return 'Code';
      default:
        return "Type '/' for commands";
    }
  };

  return (
    <div
      id={`block-${block.id}`}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onUpdate(block.id, e.currentTarget.textContent || '')}
      onKeyDown={(e) => onKeyDown(e, block.id, e.currentTarget.textContent || '')}
      className={clsx(
        'outline-none min-h-[1.5em] py-1 px-2 rounded hover:bg-gray-50 transition-colors',
        getBlockStyles(block.type),
        !block.content && 'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400'
      )}
      data-placeholder={getPlaceholder(block.type)}
    >
      {block.content}
    </div>
  );
}
