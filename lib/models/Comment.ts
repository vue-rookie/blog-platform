import type { ObjectId } from "mongodb"

export interface Comment {
  _id?: ObjectId
  postId: ObjectId
  authorId?: ObjectId
  authorName: string
  authorEmail: string
  content: string
  parentId?: ObjectId
  status: "pending" | "approved" | "rejected"
  createdAt: Date
  updatedAt: Date
  likeCount: number
}

export interface CreateCommentData {
  postId: ObjectId
  authorId?: ObjectId
  authorName: string
  authorEmail: string
  content: string
  parentId?: ObjectId
}
