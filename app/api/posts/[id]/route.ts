import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PostService } from "@/lib/services/posts"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await PostService.getPost(params.id)

    if (!post) {
      return NextResponse.json({ error: "文章不存在" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Get post error:", error)
    return NextResponse.json({ error: "获取文章失败" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "admin" && session.user.role !== "author")) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const data = await request.json()
    const success = await PostService.updatePost(params.id, data)

    if (!success) {
      return NextResponse.json({ error: "更新文章失败" }, { status: 400 })
    }

    return NextResponse.json({ message: "文章更新成功" })
  } catch (error) {
    console.error("Update post error:", error)
    return NextResponse.json({ error: "更新文章失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const success = await PostService.deletePost(params.id)

    if (!success) {
      return NextResponse.json({ error: "删除文章失败" }, { status: 400 })
    }

    return NextResponse.json({ message: "文章删除成功" })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "删除文章失败" }, { status: 500 })
  }
}
