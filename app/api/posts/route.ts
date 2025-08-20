import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PostService } from "@/lib/services/posts"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || undefined
    const authorId = searchParams.get("authorId") || undefined
    const categoryId = searchParams.get("categoryId") || undefined
    const search = searchParams.get("search") || undefined

    const { posts, total } = await PostService.getPosts({
      page,
      limit,
      status,
      authorId,
      categoryId,
      search,
    })

    return NextResponse.json({
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Get posts error:", error)
    return NextResponse.json({ error: "获取文章失败" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "admin" && session.user.role !== "author")) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const data = await request.json()
    const { title, content, excerpt, featuredImage, categoryId, tags, status, seoTitle, seoDescription } = data

    if (!title || !content) {
      return NextResponse.json({ error: "标题和内容是必填的" }, { status: 400 })
    }

    const postId = await PostService.createPost({
      title,
      slug: title,
      content,
      excerpt: excerpt || content.substring(0, 200),
      featuredImage,
      authorId: new ObjectId(session.user.id),
      categoryId: categoryId ? new ObjectId(categoryId) : undefined,
      tags: tags || [],
      status: status || "draft",
      seoTitle,
      seoDescription,
    })

    return NextResponse.json({ message: "文章创建成功", postId }, { status: 201 })
  } catch (error) {
    console.error("Create post error:", error)
    return NextResponse.json({ error: "创建文章失败" }, { status: 500 })
  }
}
