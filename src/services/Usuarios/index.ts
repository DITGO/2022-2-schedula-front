import { Services } from "@services"

const UserService = Services.usuarios.create("/users")
const AuthService = Services.usuarios.create("/auth")

export const getUsers = UserService.get()

export const getUserById = (id: number) => UserService.get({ params: { id } })

export const createUser = UserService.post<RegisterUserPayload>

export const loginUser = AuthService.post<CredentialUserPayload>

export const updateUser = UserService.put<RegisterUserPayload>

export const deleteUser = UserService.delete
