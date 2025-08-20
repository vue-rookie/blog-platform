import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CommentService } from "@/lib/services/comments"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "admin" && session.user.role !== "author")) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const { status } = await request.json()

    const success = await CommentService.updateCommentStatus(params.id, status)

    if (!success) {
      return NextResponse.json({ error: "更新评论状态失败" }, { status: 400 })
    }

    return NextResponse.json({ message: "评论状态更新成功" })
  } catch (error) {
    console.error("Update comment error:", error)
    return NextResponse.json({ error: "更新评论失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const success = await CommentService.deleteComment(params.id)

    if (!success) {
      return NextResponse.json({ error: "删除评论失败" }, { status: 400 })
    }

    return NextResponse.json({ message: "评论删除成功" })
  } catch (error) {
    console.error("Delete comment error:", error)
    return NextResponse.json({ error: "删除评论失败" }, { status: 500 })
  }
}
