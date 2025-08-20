import type { ObjectId } from "mongodb"

export interface Category {
  _id?: ObjectId
  name: string
  slug: string
  description?: string
  color?: string
  createdAt: Date
  updatedAt: Date
  postCount: number
}

export interface CreateCategoryData {
  name: string
  slug: string
  description?: string
  color?: string
}
