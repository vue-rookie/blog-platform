import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Post, CreatePostData, UpdatePostData } from "@/lib/models/Post"
import slugify from "slugify"

export class PostService {
  static async createPost(data: CreatePostData): Promise<ObjectId> {
    const db = await getDatabase()
    const postsCollection = db.collection<Post>("posts")

    // 生成唯一的slug
    let slug = slugify(data.slug || data.title, { lower: true, strict: true })
    const existingPost = await postsCollection.findOne({ slug })
    if (existingPost) {
      slug = `${slug}-${Date.now()}`
    }

    const post: Omit<Post, "_id"> = {
      ...data,
      slug,
      tags: data.tags || [],
      status: data.status || "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
    }

    if (post.status === "published" && !post.publishedAt) {
      post.publishedAt = new Date()
    }

    const result = await postsCollection.insertOne(post)
    return result.insertedId
  }

  static async updatePost(id: string, data: UpdatePostData): Promise<boolean> {
    const db = await getDatabase()
    const postsCollection = db.collection<Post>("posts")

    const updateData: Partial<Post> = {
      ...data,
      updatedAt: new Date(),
    }

    // 如果状态改为已发布且之前没有发布时间，设置发布时间
    if (data.status === "published") {
      const existingPost = await postsCollection.findOne({ _id: new ObjectId(id) })
      if (existingPost && !existingPost.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }

    // 如果更新了slug，确保唯一性
    if (data.slug) {
      let slug = slugify(data.slug, { lower: true, strict: true })
      const existingPost = await postsCollection.findOne({
        slug,
        _id: { $ne: new ObjectId(id) },
      })
      if (existingPost) {
        slug = `${slug}-${Date.now()}`
      }
      updateData.slug = slug
    }

    const result = await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return result.modifiedCount > 0
  }

  static async deletePost(id: string): Promise<boolean> {
    const db = await getDatabase()
    const postsCollection = db.collection<Post>("posts")

    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async getPost(id: string): Promise<Post | null> {
    const db = await getDatabase()
    const postsCollection = db.collection<Post>("posts")

    return await postsCollection.findOne({ _id: new ObjectId(id) })
  }

  static async getPostBySlug(slug: string): Promise<Post | null> {
    const db = await getDatabase()
    const postsCollection = db.collection<Post>("posts")

    return await postsCollection.findOne({ slug })
  }

  static async getPosts(
    options: {
      page?: number
      limit?: number
      status?: string
      authorId?: string
      categoryId?: string
      search?: string
      sortBy?: string
    } = {},
  ): Promise<{ posts: Post[]; total: number }> {
    const db = await getDatabase()
    const postsCollection = db.collection<Post>("posts")

    const { page = 1, limit = 10, status, authorId, categoryId, search, sortBy = "newest" } = options

    const filter: any = {}

    if (status) {
      filter.status = status
    }

    if (authorId) {
      filter.authorId = new ObjectId(authorId)
    }

    if (categoryId) {
      filter.categoryId = new ObjectId(categoryId)
    }

    if (search) {
      // Handle special search formats
      if (search.startsWith("tags:")) {
        const tag = search.replace("tags:", "")
        filter.tags = { $in: [tag] }
      } else {
        // Full text search
        filter.$text = { $search: search }
      }
    }

    // Build sort options
    let sortOptions: any = { createdAt: -1 }
    switch (sortBy) {
      case "oldest":
        sortOptions = { createdAt: 1 }
        break
      case "popular":
        sortOptions = { viewCount: -1 }
        break
      case "comments":
        sortOptions = { commentCount: -1 }
        break
      default:
        sortOptions = { createdAt: -1 }
    }

    const total = await postsCollection.countDocuments(filter)
    const posts = await postsCollection
      .find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray()

    return { posts, total }
  }

  static async incrementViewCount(id: string): Promise<void> {
    const db = await getDatabase()
    const postsCollection = db.collection<Post>("posts")

    await postsCollection.updateOne({ _id: new ObjectId(id) }, { $inc: { viewCount: 1 } })
  }
}
