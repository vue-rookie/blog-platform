import { NextResponse } from "next/server"
import { CategoryService } from "@/lib/services/categories"

export async function GET() {
  try {
    const categories = await CategoryService.getAllCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "获取分类失败" }, { status: 500 })
  }
}
