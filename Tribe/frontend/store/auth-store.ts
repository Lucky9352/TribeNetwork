/**
 * Authentication Store (Zustand)
 * Manages user authentication state
 */

import { create } from 'zustand'
import { flarumAPI, FlarumUser } from '@/lib/flarum-api'

interface AuthState {
  user: FlarumUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (identification: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (identification: string, password: string) => {
    try {
      set({ isLoading: true })
      await flarumAPI.login({ identification, password })
      const user = await flarumAPI.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: () => {
    flarumAPI.logout()
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: async () => {
    if (typeof window === 'undefined') {
      set({ isLoading: false })
      return
    }

    if (!flarumAPI.isAuthenticated()) {
      set({ isLoading: false, isAuthenticated: false, user: null })
      return
    }

    try {
      const user = await flarumAPI.getCurrentUser()
      set({ user, isAuthenticated: true, isLoading: false })
    } catch {
      flarumAPI.clearToken()
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },
}))

if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth()
}
