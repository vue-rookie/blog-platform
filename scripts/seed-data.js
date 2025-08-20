import { getDatabase } from "../lib/mongodb.js"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

async function seedDatabase() {
  try {
    console.log("开始填充示例数据...")
    const db = await getDatabase()

    // 创建管理员用户
    const usersCollection = db.collection("users")
    const hashedPassword = await bcrypt.hash("admin123", 12)

    const adminUser = {
      _id: new ObjectId(),
      username: "admin",
      email: "admin@blog.com",
      password: hashedPassword,
      role: "admin",
      bio: "博客平台管理员",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    const authorUser = {
      _id: new ObjectId(),
      username: "author",
      email: "author@blog.com",
      password: await bcrypt.hash("author123", 12),
      role: "author",
      bio: "热爱写作的作者",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
    }

    await usersCollection.insertMany([adminUser, authorUser])
    console.log("✓ 用户数据创建完成")

    // 创建分类
    const categoriesCollection = db.collection("categories")
    const categories = [
      {
        _id: new ObjectId(),
        name: "技术",
        slug: "tech",
        description: "技术相关文章",
        color: "#059669",
        createdAt: new Date(),
        updatedAt: new Date(),
        postCount: 0,
      },
      {
        _id: new ObjectId(),
        name: "生活",
        slug: "life",
        description: "生活感悟和经验分享",
        color: "#10b981",
        createdAt: new Date(),
        updatedAt: new Date(),
        postCount: 0,
      },
      {
        _id: new ObjectId(),
        name: "教程",
        slug: "tutorial",
        description: "实用教程和指南",
        color: "#6366f1",
        createdAt: new Date(),
        updatedAt: new Date(),
        postCount: 0,
      },
    ]

    await categoriesCollection.insertMany(categories)
    console.log("✓ 分类数据创建完成")

    // 创建示例文章
    const postsCollection = db.collection("posts")
    const posts = [
      {
        _id: new ObjectId(),
        title: "欢迎来到现代博客平台",
        slug: "welcome-to-modern-blog",
        content: `# 欢迎来到现代博客平台

这是一个功能完整的现代化博客平台，使用 Next.js 和 MongoDB 构建。

## 主要功能

- 📝 文章发布和管理
- 👥 用户认证和权限管理
- 💬 评论系统
- 🏷️ 标签和分类
- 🔍 搜索功能
- 📱 响应式设计

## 技术栈

- **前端**: Next.js, React, Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: MongoDB
- **认证**: NextAuth.js

开始探索这个平台吧！`,
        excerpt: "欢迎来到我们的现代博客平台，这里有丰富的功能等你探索。",
        authorId: adminUser._id,
        categoryId: categories[0]._id,
        tags: ["欢迎", "介绍", "功能"],
        status: "published",
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        seoTitle: "欢迎来到现代博客平台",
        seoDescription: "探索我们功能完整的现代化博客平台",
      },
      {
        _id: new ObjectId(),
        title: "Next.js 全栈开发指南",
        slug: "nextjs-fullstack-guide",
        content: `# Next.js 全栈开发指南

Next.js 是一个强大的 React 框架，支持全栈开发。

## 为什么选择 Next.js？

1. **服务端渲染 (SSR)**
2. **静态站点生成 (SSG)**
3. **API Routes**
4. **自动代码分割**
5. **内置 CSS 支持**

## 开始你的第一个项目

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

这就是开始的全部！`,
        excerpt: "学习如何使用 Next.js 构建现代化的全栈应用程序。",
        authorId: authorUser._id,
        categoryId: categories[2]._id,
        tags: ["Next.js", "全栈", "教程"],
        status: "published",
        publishedAt: new Date(Date.now() - 86400000), // 1天前
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(Date.now() - 86400000),
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        seoTitle: "Next.js 全栈开发完整指南",
        seoDescription: "从零开始学习 Next.js 全栈开发",
      },
    ]

    await postsCollection.insertMany(posts)
    console.log("✓ 文章数据创建完成")

    // 更新分类的文章数量
    await categoriesCollection.updateOne({ _id: categories[0]._id }, { $set: { postCount: 1 } })
    await categoriesCollection.updateOne({ _id: categories[2]._id }, { $set: { postCount: 1 } })

    console.log("🎉 示例数据填充完成！")
    console.log("管理员账号: admin@blog.com / admin123")
    console.log("作者账号: author@blog.com / author123")
  } catch (error) {
    console.error("❌ 数据填充失败:", error)
    process.exit(1)
  }
}

seedDatabase()
