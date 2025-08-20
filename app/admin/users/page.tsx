import { UserList } from "@/components/admin/user-list"

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">用户管理</h1>
        <p className="text-muted-foreground">管理平台用户和权限</p>
      </div>

      <UserList />
    </div>
  )
}
