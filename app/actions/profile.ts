"use server"

import { apiClient } from "@/lib/api-client"
import { cookies } from "next/headers"

/**
 * Update a user profile
 * @param data: Profile values
 */
export async function updateProfile(data: {
  id: string
  display_name: string
  currency: string
}) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)

  const { id, ...profileData } = data
  await apiClient.patch("/api/profile/", profileData)
}

/**
 * 
 * @param userId User id to fetch his profiles
 * @returns list of user profiles
 */

export async function getUserProfiles(userId: string) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value
  
  if (!token) {
    throw new Error("Not authenticated")
  }

  apiClient.setToken(token)
  const profile = await apiClient.get<{
    id: string;
    email: string;
    display_name: string | null;
    currency: string;
  }>("/api/profile/")
  
  return [profile] as {
    display_name: string;
    email: string;
    currency: string
  }[]
}