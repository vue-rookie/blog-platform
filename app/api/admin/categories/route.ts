import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import slugify from "slugify"
import type { Category } from "@/lib/models/Category"

export async function GET() {
  try {
    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    const categories = await categoriesCollection.find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "admin" && session.user.role !== "author")) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const { name, slug, description, color } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "名称和别名是必填的" }, { status: 400 })
    }

    const db = await getDatabase()
    const categoriesCollection = db.collection<Category>("categories")

    // Check if slug already exists
    const existingCategory = await categoriesCollection.findOne({ slug })
    if (existingCategory) {
      return NextResponse.json({ error: "URL别名已存在" }, { status: 400 })
    }

    const category: Omit<Category, "_id"> = {
      name,
      slug: slugify(slug, { lower: true, strict: true }),
      description,
      color: color || "#059669",
      createdAt: new Date(),
      updatedAt: new Date(),
      postCount: 0,
    }

    const result = await categoriesCollection.insertOne(category)

    return NextResponse.json({ message: "分类创建成功", categoryId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Create category error:", error)
    return NextResponse.json({ error: "创建分类失败" }, { status: 500 })
  }
}
