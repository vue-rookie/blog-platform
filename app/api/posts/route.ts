import { type NextRequest } from "next/server"
import { PostService } from "@/lib/services/posts"
import { ObjectId } from "mongodb"
import { withApiHandler, apiError, apiSuccess, parseRequestBody, validateRequestBody, checkAuth } from "@/lib/api-utils"

export const GET = withApiHandler(async (request: NextRequest) => {
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

  return apiSuccess({
    posts,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
})

export const POST = withApiHandler(async (request: NextRequest) => {
  const session = await checkAuth(request, ["admin", "author"])
  
  const body = await parseRequestBody(request)
  const { title, content, excerpt, featuredImage, categoryId, tags, status, seoTitle, seoDescription } = 
    validateRequestBody<{
      title: string
      content: string
      excerpt?: string
      featuredImage?: string
      categoryId?: string
      tags?: string[]
      status?: string
      seoTitle?: string
      seoDescription?: string
    }>(body, ["title", "content"])

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

  return apiSuccess({ postId }, "文章创建成功", 201)
})
