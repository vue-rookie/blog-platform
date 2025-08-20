import { type NextRequest, NextResponse } from "next/server"
import { CategoryService } from "@/lib/services/categories"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const category = await CategoryService.getCategoryBySlug(params.slug)

    if (!category) {
      return NextResponse.json({ error: "分类不存在" }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Get category error:", error)
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 })
  }
}
