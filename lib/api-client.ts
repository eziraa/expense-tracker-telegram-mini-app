/**
 * API Client for FastAPI backend
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface ApiError {
  detail: string
}

export class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
    // Get token from localStorage if available (client-side only)
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setToken(token: string | null) {
    this.token = token
    // Only update localStorage on client-side
    if (typeof window !== "undefined") {
      if (token) {
        localStorage.setItem("auth_token", token)
      } else {
        localStorage.removeItem("auth_token")
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      // Create abort controller for timeout (works in both browser and Node.js)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const error: ApiError = await response.json().catch(() => ({
          detail: `HTTP ${response.status}: ${response.statusText}`,
        }))
        throw new Error(error.detail || "An error occurred")
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null as T
      }

      return response.json()
    } catch (error: any) {
      // Handle network errors gracefully
      if (error.name === 'AbortError' || error.message?.includes('fetch') || error.message?.includes('aborted')) {
        throw new Error("Network error: Unable to connect to server. Please ensure the backend is running.")
      }
      throw error
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

// Singleton instance
export const apiClient = new ApiClient()

