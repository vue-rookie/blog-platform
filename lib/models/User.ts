import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  username: string
  email: string
  password: string
  role: "admin" | "author" | "reader"
  avatar?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

export interface CreateUserData {
  username: string
  email: string
  password: string
  role?: "admin" | "author" | "reader"
  avatar?: string
  bio?: string
}

export interface UpdateUserData {
  username?: string
  email?: string
  avatar?: string
  bio?: string
  isActive?: boolean
}
