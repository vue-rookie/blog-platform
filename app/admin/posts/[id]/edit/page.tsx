import { PostEditor } from "@/components/posts/post-editor"
import { PostService } from "@/lib/services/posts"
import { notFound } from "next/navigation"

interface EditPostPageProps {
  params: {
    id: string
  }
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await PostService.getPost(params.id)

  if (!post) {
    notFound()
  }

  return <PostEditor post={post} />
}
