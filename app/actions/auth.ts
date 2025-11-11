'use server'
import { apiClient } from "@/lib/api-client";
import { getUserProfiles } from "./profile";
import { cookies } from "next/headers";

/**
 * 
 * Get Logged in user
 * @returns logged in user data
 */

export async function getLoggedInUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value

    if (!token) {
        throw new Error("Not authenticated")
    }

    // Set token in API client
    apiClient.setToken(token)

    try {
        const user = await apiClient.get<{
            id: string;
            email: string;
            is_active: boolean;
            profile: {
                id: string;
                email: string;
                display_name: string | null;
                currency: string;
            } | null;
        }>("/api/auth/me")

        const profileData = user.profile ? [user.profile] : []
        return {
            id: user.id,
            email: user.email,
            profiles: profileData
        }
    } catch (error) {
        console.log(error)
        throw new Error(error instanceof Error ? error.message : "Failed to get user")
    }
}