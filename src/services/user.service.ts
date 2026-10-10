import { http } from '../api/http-client'
import type { User, CreateUserDto, UpdateUserDto, UsersResponse } from '../types/user'
import type { Readable, Creatable, Editable, Deletable } from './interfaces'

export class UserService
  implements
    Readable<User>,
    Creatable<User, CreateUserDto>,
    Editable<User, UpdateUserDto>,
    Deletable
{
  async getAll({ limit = 10, skip = 0, q = '' } = {}): Promise<UsersResponse> {
    const endpoint = q
      ? `/users/search?q=${q}&limit=${limit}&skip=${skip}`
      : `/users?limit=${limit}&skip=${skip}`
    return await http<UsersResponse>(endpoint)
  }

  async getById(id: number): Promise<User> {
    return await http<User>(`/users/${id}`)
  }

  async create(data: CreateUserDto): Promise<User> {
    return await http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) })
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    return await http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }

  async delete(id: number): Promise<void> {
    await http(`/users/${id}`, { method: 'DELETE' })
  }
}
