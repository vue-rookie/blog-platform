import type { ObjectId } from "mongodb"

export interface Post {
  _id?: ObjectId
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  authorId: ObjectId
  categoryId?: ObjectId
  tags: string[]
  status: "draft" | "published" | "archived"
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
  viewCount: number
  likeCount: number
  commentCount: number
  seoTitle?: string
  seoDescription?: string
}

export interface CreatePostData {
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage?: string
  authorId: ObjectId
  categoryId?: ObjectId
  tags?: string[]
  status?: "draft" | "published"
  seoTitle?: string
  seoDescription?: string
}

export interface UpdatePostData {
  title?: string
  slug?: string
  content?: string
  excerpt?: string
  featuredImage?: string
  categoryId?: ObjectId
  tags?: string[]
  status?: "draft" | "published" | "archived"
  seoTitle?: string
  seoDescription?: string
}
