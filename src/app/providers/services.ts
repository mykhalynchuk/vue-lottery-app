import { ServiceProvider } from '@/shared/api/service-provider'
import { UserService } from '@/entities/user/api/user.service'
import { AuthService } from '@/entities/session/api/auth.service'

export function registerServices(): void {
  ServiceProvider.register('users', () => new UserService())
  ServiceProvider.register('auth', () => new AuthService())
}
