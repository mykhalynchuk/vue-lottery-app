import { http } from '../api/http-client'
import type { AuthUser } from '../types/auth'

export class AuthService {
  async login(credentials: Record<string, string>): Promise<AuthUser> {
    return await http<AuthUser>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ ...credentials, expiresInMins: 60 }),
    })
  }

  async refresh(refreshToken: string): Promise<AuthUser> {
    return await http<AuthUser>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken, expiresInMins: 60 }),
    })
  }

  async me(): Promise<AuthUser> {
    return await http<AuthUser>('/auth/me', { method: 'GET' })
  }
}
