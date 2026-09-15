export type VmgCategory =
  | 'actualites'
  | 'evenements'
  | 'aide-alimentaire'
  | 'friperie'
  | 'mobilisation'
  | 'vie-asso'
  | 'communique'
  | 'galerie';

export interface PostFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: VmgCategory | string;
  language: 'fr';
  keywords: string[];
  readingTime: number;
  draft: boolean;
  image?: string;
  sourceBlog?: 'voisinsmoulingalant' | 'veth91';
  sourceUrl?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
}

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  category: string;
  readingTime: number;
  keywords: string[];
  image?: string;
  draft?: boolean;
}
