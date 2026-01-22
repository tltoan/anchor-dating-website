/**
 * Secure token storage utility for Next.js
 * Uses localStorage with proper error handling and security best practices
 */

const AUTH_TOKEN_KEY = 'anchor_auth_token'
const AUTH_REFRESH_TOKEN_KEY = 'anchor_auth_refresh_token'
const AUTH_USER_KEY = 'anchor_auth_user'

export interface AuthUser {
  id: string
  email: string
  name?: string
}

/**
 * Store authentication token securely in localStorage
 */
export const setAuthToken = (token: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    }
  } catch (error) {
    console.error('Failed to store auth token:', error)
  }
}

/**
 * Get authentication token from localStorage
 */
export const getAuthToken = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }
    return null
  } catch (error) {
    console.error('Failed to get auth token:', error)
    return null
  }
}

/**
 * Store refresh token securely in localStorage
 */
export const setRefreshToken = (token: string): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_REFRESH_TOKEN_KEY, token)
    }
  } catch (error) {
    console.error('Failed to store refresh token:', error)
  }
}

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_REFRESH_TOKEN_KEY)
    }
    return null
  } catch (error) {
    console.error('Failed to get refresh token:', error)
    return null
  }
}

/**
 * Store user data securely in localStorage
 */
export const setAuthUser = (user: AuthUser): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
    }
  } catch (error) {
    console.error('Failed to store auth user:', error)
  }
}

/**
 * Get user data from localStorage
 */
export const getAuthUser = (): AuthUser | null => {
  try {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(AUTH_USER_KEY)
      if (userStr) {
        return JSON.parse(userStr) as AuthUser
      }
    }
    return null
  } catch (error) {
    console.error('Failed to get auth user:', error)
    return null
  }
}

/**
 * Clear all authentication data from localStorage
 */
export const clearAuthData = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_REFRESH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    }
  } catch (error) {
    console.error('Failed to clear auth data:', error)
  }
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null
}
