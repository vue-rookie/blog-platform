import { CategoryList } from "@/components/admin/category-list"

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">分类管理</h1>
        <p className="text-muted-foreground">管理文章分类和标签</p>
      </div>

      <CategoryList />
    </div>
  )
}
