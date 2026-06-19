export type BlogStatus = "draft" | "published";
export type BlogBlockType = "heading" | "paragraph" | "quote" | "list";

export interface IBlogContentBlock {
  type: BlogBlockType;
  text?: string;
  level?: number;
  items?: string[];
}

export interface IBlog {
  _id: string;
  title: string;
  subtitle?: string;
  slug: string;
  excerpt?: string;
  category: string;
  readTime: string;
  author?: string;
  primaryImage: string;
  primaryImageId: string;
  secondaryImage?: string;
  secondaryImageId?: string;
  contentBlocks: IBlogContentBlock[];
  tags: string[];
  status: BlogStatus;
  featured: boolean;
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IBlogResponse {
  success: boolean;
  data: IBlog[];
}

export interface IBlogMutationResponse {
  success: boolean;
  message: string;
  data?: IBlog;
}
