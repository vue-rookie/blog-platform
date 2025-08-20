import { getDatabase } from "../lib/mongodb.js"

async function initializeDatabase() {
  try {
    console.log("开始初始化数据库...")
    const db = await getDatabase()

    // 创建用户集合和索引
    const usersCollection = db.collection("users")
    await usersCollection.createIndex({ email: 1 }, { unique: true })
    await usersCollection.createIndex({ username: 1 }, { unique: true })
    console.log("✓ 用户集合和索引创建完成")

    // 创建文章集合和索引
    const postsCollection = db.collection("posts")
    await postsCollection.createIndex({ slug: 1 }, { unique: true })
    await postsCollection.createIndex({ authorId: 1 })
    await postsCollection.createIndex({ categoryId: 1 })
    await postsCollection.createIndex({ status: 1 })
    await postsCollection.createIndex({ publishedAt: -1 })
    await postsCollection.createIndex({ tags: 1 })
    await postsCollection.createIndex({ title: "text", content: "text" })
    console.log("✓ 文章集合和索引创建完成")

    // 创建分类集合和索引
    const categoriesCollection = db.collection("categories")
    await categoriesCollection.createIndex({ slug: 1 }, { unique: true })
    await categoriesCollection.createIndex({ name: 1 })
    console.log("✓ 分类集合和索引创建完成")

    // 创建评论集合和索引
    const commentsCollection = db.collection("comments")
    await commentsCollection.createIndex({ postId: 1 })
    await commentsCollection.createIndex({ authorId: 1 })
    await commentsCollection.createIndex({ parentId: 1 })
    await commentsCollection.createIndex({ status: 1 })
    await commentsCollection.createIndex({ createdAt: -1 })
    console.log("✓ 评论集合和索引创建完成")

    console.log("🎉 数据库初始化完成！")
  } catch (error) {
    console.error("❌ 数据库初始化失败:", error)
    process.exit(1)
  }
}

initializeDatabase()
