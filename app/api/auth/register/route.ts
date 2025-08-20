import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"
import type { CreateUserData } from "@/lib/models/User"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    if (!username || !email || !password) {
      return NextResponse.json({ error: "所有字段都是必填的" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "密码至少需要6个字符" }, { status: 400 })
    }

    const db = await getDatabase()
    const usersCollection = db.collection("users")

    // 检查用户是否已存在
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "用户名或邮箱已存在" }, { status: 400 })
    }

    // 创建新用户
    const hashedPassword = await bcrypt.hash(password, 12)
    const userData: CreateUserData = {
      username,
      email,
      password: hashedPassword,
      role: "reader",
    }

    const newUser = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    const result = await usersCollection.insertOne(newUser)

    return NextResponse.json(
      {
        message: "用户创建成功",
        userId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "服务器错误" }, { status: 500 })
  }
}
