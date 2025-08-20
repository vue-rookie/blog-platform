import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PostEditor } from "@/components/posts/post-editor"

export default async function WritePage() {
  const session = await getServerSession(authOptions)

  if (!session || (session.user.role !== "admin" && session.user.role !== "author")) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-background">
      <PostEditor />
    </div>
  )
}
