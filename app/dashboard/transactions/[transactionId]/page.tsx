import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { EditTransactionContent } from "@/components/edit-transaction-content"
import { redirect } from "next/navigation"
import { getLoggedInUser } from "@/app/actions/auth"


export default async function EditTransactionPage({ params }: { params: Promise<{ transactionId: string }> }) {
    const cookieStore = await cookies()
    const token = cookieStore.get("auth_token")?.value
    const { transactionId } = await params

    if (!token) {
        redirect("/auth/login")
    }

    apiClient.setToken(token)

    try {
        const user = await getLoggedInUser()
        const [accounts, categories, transaction] = await Promise.all([
            apiClient.get("/api/accounts/"),
            apiClient.get("/api/categories/"),
            apiClient.get(`/api/transactions/${transactionId}`),
        ])

        return (
            <EditTransactionContent 
                transaction={transaction as any} 
                accounts={accounts as any[]} 
                categories={categories as any[]} 
                userId={user.id} 
            />
        )
    } catch (error: any) {
        // If it's an authentication error, clear token and redirect
        if (error?.message?.includes("401") || error?.message?.includes("Unauthorized") || error?.message?.includes("Not authenticated")) {
            cookieStore.delete("auth_token")
            redirect("/auth/login")
        }
        // For other errors, redirect to transactions list
        redirect("/dashboard/transactions")
    }
}
