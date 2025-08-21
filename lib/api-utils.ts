import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export interface ApiError {
  error: string
  details?: any
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

/**
 * 统一的API错误响应
 */
export function apiError(message: string, status: number = 500, details?: any): NextResponse<ApiError> {
  console.error(`API Error [${status}]:`, message, details)
  return NextResponse.json(
    { error: message, ...(details && { details }) },
    { status }
  )
}

/**
 * 统一的API成功响应
 */
export function apiSuccess<T>(data?: T, message?: string, status: number = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      ...(data !== undefined && { data }),
      ...(message && { message })
    },
    { status }
  )
}

/**
 * API路由包装器，提供统一的错误处理
 */
export function withApiHandler(handler: (req: NextRequest, context?: any) => Promise<NextResponse>) {
  return async (req: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      return await handler(req, context)
    } catch (error: any) {
      console.error("API Handler Error:", error)
      return apiError(
        error.message || "Internal server error",
        error.status || 500,
        process.env.NODE_ENV === "development" ? error.stack : undefined
      )
    }
  }
}

/**
 * 检查用户认证状态
 */
export async function checkAuth(req: NextRequest, requiredRoles?: string[]) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    throw { message: "未授权", status: 401 }
  }

  if (requiredRoles && !requiredRoles.includes(session.user.role)) {
    throw { message: "权限不足", status: 403 }
  }

  return session
}

/**
 * 验证请求体
 */
export function validateRequestBody<T>(body: any, requiredFields: (keyof T)[]): T {
  const missingFields = requiredFields.filter(field => !body[field])
  
  if (missingFields.length > 0) {
    throw { 
      message: `缺少必填字段: ${missingFields.join(", ")}`, 
      status: 400 
    }
  }

  return body as T
}

/**
 * 解析请求体
 */
export async function parseRequestBody(req: NextRequest) {
  try {
    return await req.json()
  } catch (error) {
    throw { message: "无效的JSON格式", status: 400 }
  }
}