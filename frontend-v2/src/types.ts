export interface Author {
  id: number;
  documentId: string;
  name: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface CoverImage {
  id: number;
  documentId: string;
  name: string;
  url: string;
  width: number;
  height: number;
  formats?: any;
}

export interface Story {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  coverImage: CoverImage | null;
  author: Author | null;
}
