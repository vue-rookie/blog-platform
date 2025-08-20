import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "未授权" }, { status: 401 })
    }

    const { username, bio, location, avatar } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "用户名是必填的" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const existingUser = await usersCollection.findOne({
      username,
      _id: { $ne: new ObjectId(session.user.id) },
    })

    if (existingUser) {
      return NextResponse.json({ error: "用户名已被使用" }, { status: 400 })
    }

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          username,
          bio,
          location,
          avatar,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    return NextResponse.json({ message: "个人资料更新成功" })
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
