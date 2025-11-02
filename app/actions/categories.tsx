"use server"

import { createClient } from "@/lib/server"

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
    const client = await createClient()
    const { data: category, error } = await client
        .from("categories")
        .insert([data])
        .single()

    if (error) {
        throw new Error(error.message)
    }

    return category
}

/** 
 * 
 * Update a category by ID
 * @param id: Category ID
 * @param updates: Fields to update
 */

export async function deleteCategory(id: string) {
    const client = await createClient()
    const { error } = await client.from("categories").delete().eq("id", id)
    if (error) {
        throw new Error(error.message)
    }
    return true
}