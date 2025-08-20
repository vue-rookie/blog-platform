import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const { isActive } = await request.json()

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(params.id) },
      { $set: { isActive, updatedAt: new Date() } },
    )

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 })
    }

    return NextResponse.json({ message: "用户状态更新成功" })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 })
  }
}
