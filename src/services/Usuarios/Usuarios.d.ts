type Accesses = "basic" | "manager" | "admin"

interface User {
  token?: string
  username: string
  email: string
  name: string
  active: boolean
  acess: Accesses // todo: fix on backend
  job_role: string
}

interface RegisterUserPayload {
  username: string
  email: string
  name: string
  acess: Accesses
  job_role: string
  password: string
  confirmPassword: string
}

interface CredentialUser {
  credential: string
  value: string
}
