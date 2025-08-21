import { type NextRequest } from "next/server"
import bcrypt from "bcryptjs"
import { getDatabase } from "@/lib/mongodb"
import type { CreateUserData } from "@/lib/models/User"
import { withApiHandler, apiError, apiSuccess, parseRequestBody, validateRequestBody } from "@/lib/api-utils"

export const POST = withApiHandler(async (request: NextRequest) => {
  const body = await parseRequestBody(request)
  const { username, email, password } = validateRequestBody<{
    username: string
    email: string
    password: string
  }>(body, ["username", "email", "password"])

  if (password.length < 6) {
    return apiError("密码至少需要6个字符", 400)
  }

  const db = await getDatabase()
  const usersCollection = db.collection("users")

  // 检查用户是否已存在
  const existingUser = await usersCollection.findOne({
    $or: [{ email }, { username }],
  })

  if (existingUser) {
    return apiError("用户名或邮箱已存在", 400)
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

  return apiSuccess(
    { userId: result.insertedId },
    "用户创建成功",
    201
  )
})
