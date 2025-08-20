import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CommentService } from "@/lib/services/comments"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { postId, content, authorName, authorEmail, parentId } = await request.json()

    if (!postId || !content) {
      return NextResponse.json({ error: "文章ID和评论内容是必填的" }, { status: 400 })
    }

    // If user is not logged in, require name and email
    if (!session && (!authorName || !authorEmail)) {
      return NextResponse.json({ error: "请提供姓名和邮箱" }, { status: 400 })
    }

    const commentData = {
      postId: new ObjectId(postId),
      authorId: session ? new ObjectId(session.user.id) : undefined,
      authorName: session ? session.user.name : authorName,
      authorEmail: session ? session.user.email : authorEmail,
      content,
      parentId: parentId ? new ObjectId(parentId) : undefined,
    }

    const commentId = await CommentService.createComment(commentData)

    return NextResponse.json({ message: "评论发表成功", commentId }, { status: 201 })
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json({ error: "发表评论失败" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get("postId")

    if (!postId) {
      return NextResponse.json({ error: "文章ID是必填的" }, { status: 400 })
    }

    const comments = await CommentService.getCommentsByPost(postId)

    return NextResponse.json({ comments })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "获取评论失败" }, { status: 500 })
  }
}
