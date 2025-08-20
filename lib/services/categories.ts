import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import type { Category, CreateCategoryData } from "@/lib/models/Category"
import slugify from "slugify"

export class CategoryService {
  static async createCategory(data: CreateCategoryData): Promise<ObjectId> {
    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    const category: Omit<Category, "_id"> = {
      ...data,
      slug: slugify(data.slug, { lower: true, strict: true }),
      createdAt: new Date(),
      updatedAt: new Date(),
      postCount: 0,
    }

    const result = await categoriesCollection.insertOne(category)
    return result.insertedId
  }

  static async getAllCategories(): Promise<Category[]> {
    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    return await categoriesCollection.find({}).sort({ name: 1 }).toArray()
  }

  static async getCategoryBySlug(slug: string): Promise<Category | null> {
    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    return await categoriesCollection.findOne({ slug })
  }

  static async updateCategory(id: string, data: Partial<Category>): Promise<boolean> {
    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    const updateData = {
      ...data,
      updatedAt: new Date(),
    }

    if (data.slug) {
      updateData.slug = slugify(data.slug, { lower: true, strict: true })
    }

    const result = await categoriesCollection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return result.modifiedCount > 0
  }

  static async deleteCategory(id: string): Promise<boolean> {
    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    const result = await categoriesCollection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  }

  static async updatePostCount(categoryId: string, increment: number): Promise<void> {
    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    await categoriesCollection.updateOne({ _id: new ObjectId(categoryId) }, { $inc: { postCount: increment } })
  }
}
