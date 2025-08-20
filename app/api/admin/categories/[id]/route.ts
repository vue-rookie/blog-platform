import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CategoryService } from "@/lib/services/categories"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user.role !== "admin" && session.user.role !== "author")) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const data = await request.json()
    const success = await CategoryService.updateCategory(params.id, data)

    if (!success) {
      return NextResponse.json({ error: "更新分类失败" }, { status: 400 })
    }

    return NextResponse.json({ message: "分类更新成功" })
  } catch (error) {
    console.error("Update category error:", error)
    return NextResponse.json({ error: "更新分类失败" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const success = await CategoryService.deleteCategory(params.id)

    if (!success) {
      return NextResponse.json({ error: "删除分类失败" }, { status: 400 })
    }

    return NextResponse.json({ message: "分类删除成功" })
  } catch (error) {
    console.error("Delete category error:", error)
    return NextResponse.json({ error: "删除分类失败" }, { status: 500 })
  }
}
