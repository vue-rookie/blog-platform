import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Comment, CreateCommentData } from "@/lib/models/Comment"

export class CommentService {
  static async createComment(data: CreateCommentData): Promise<ObjectId> {
    const db = await getDatabase()
    const commentsCollection = db.collection<Comment>("comments")

    const comment: Omit<Comment, "_id"> = {
      ...data,
      status: "approved", // Auto-approve for now, can add moderation later
      createdAt: new Date(),
      updatedAt: new Date(),
      likeCount: 0,
    }

    const result = await commentsCollection.insertOne(comment)

    // Update post comment count
    const postsCollection = db.collection("posts")
    await postsCollection.updateOne({ _id: data.postId }, { $inc: { commentCount: 1 } })

    return result.insertedId
  }

  static async getCommentsByPost(postId: string): Promise<Comment[]> {
    const db = await getDatabase()
    const commentsCollection = db.collection<Comment>("comments")

    return await commentsCollection
      .find({
        postId: new ObjectId(postId),
        status: "approved",
      })
      .sort({ createdAt: -1 })
      .toArray()
  }

  static async deleteComment(id: string): Promise<boolean> {
    const db = await getDatabase()
    const commentsCollection = db.collection<Comment>("comments")

    const comment = await commentsCollection.findOne({ _id: new ObjectId(id) })
    if (!comment) return false

    const result = await commentsCollection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount > 0) {
      // Update post comment count
      const postsCollection = db.collection("posts")
      await postsCollection.updateOne({ _id: comment.postId }, { $inc: { commentCount: -1 } })
    }

    return result.deletedCount > 0
  }

  static async getAllComments(
    options: {
      page?: number
      limit?: number
      status?: string
    } = {},
  ): Promise<{ comments: Comment[]; total: number }> {
    const db = await getDatabase()
    const commentsCollection = db.collection<Comment>("comments")

    const { page = 1, limit = 10, status } = options

    const filter: any = {}
    if (status) {
      filter.status = status
    }

    const total = await commentsCollection.countDocuments(filter)
    const comments = await commentsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return { comments, total }
  }

  static async updateCommentStatus(id: string, status: string): Promise<boolean> {
    const db = await getDatabase()
    const commentsCollection = db.collection<Comment>("comments")

    const result = await commentsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
    )

    return result.modifiedCount > 0
  }
}
