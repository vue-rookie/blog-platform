import { type NextRequest } from "next/server"
import { withApiHandler, apiError, apiSuccess, checkAuth } from "@/lib/api-utils"

export const POST = withApiHandler(async (request: NextRequest) => {
  await checkAuth(request, ["admin", "author"])

  const formData = await request.formData()
  const file = formData.get("file") as File

  if (!file) {
    return apiError("没有选择文件", 400)
  }

  // 检查文件类型
  if (!file.type.startsWith("image/")) {
    return apiError("只支持图片文件", 400)
  }

  // 检查文件大小 (5MB)
  if (file.size > 5 * 1024 * 1024) {
    return apiError("文件大小不能超过5MB", 400)
  }

  // 生成文件名
  const timestamp = Date.now()
  const extension = file.name.split(".").pop()
  const filename = `${timestamp}.${extension}`

  // 转换为base64用于演示（实际项目中应该上传到云存储）
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString("base64")
  const dataUrl = `data:${file.type};base64,${base64}`

  return apiSuccess({
    url: dataUrl,
    filename,
    size: file.size,
    type: file.type,
  }, "文件上传成功")
})
