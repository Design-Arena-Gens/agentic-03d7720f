export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'quote'
  | 'code';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export interface Page {
  id: string;
  title: string;
  content: Block[];
  icon: string;
  createdAt: string;
  updatedAt: string;
}
