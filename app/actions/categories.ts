"use server"

import { apiClient } from "@/lib/api-client"
import { cookies } from "next/headers"

/** 
 * 
 * Create a new category
 * @param data: Category values
 * @returns category instance
 */
export async function createCategory(data: {
    user_id: string
    name: string
    type: "expense" | "income"
    icon?: string
    color?: string
}) {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    
    if (!token) {
        throw new Error("Not authenticated")
    }

    apiClient.setToken(token)

    const { user_id, ...categoryData } = data
    return apiClient.post("/api/categories/", categoryData)
}

/** 
 * 
 * Delete a category by ID
 * @param id: Category ID
 */

export async function deleteCategory(id: string) {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    
    if (!token) {
        throw new Error("Not authenticated")
    }

    apiClient.setToken(token)
    await apiClient.delete(`/api/categories/${id}`)
    return true
}