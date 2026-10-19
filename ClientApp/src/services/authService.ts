// TEMPORÁRIO: sem backend, credenciais e token são gerados no navegador.
// O token segue o formato JWT (header.payload.signature), mas NÃO é assinado
// e não oferece segurança real. Substituir por chamada à API quando existir.
const TOKEN_STORAGE_KEY = 'epc.auth.token'
const TOKEN_TTL_SECONDS = 8 * 60 * 60

const TEMPORARY_CREDENTIALS = { username: 'admin', password: 'admin' }

export type AuthUser = {
  username: string
  name: string
}

type TokenPayload = AuthUser & {
  sub: string
  iat: number
  exp: number
}

function encodeSegment(value: object): string {
  const bytes = new TextEncoder().encode(JSON.stringify(value))
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeSegment<T>(segment: string): T {
  const base64 = segment.replace(/-/g, '+').replace(/_/g, '/')
  const binary = atob(base64)
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return JSON.parse(new TextDecoder().decode(bytes)) as T
}

function createToken(user: AuthUser): string {
  const issuedAt = Math.floor(Date.now() / 1000)
  const payload: TokenPayload = {
    ...user,
    sub: user.username,
    iat: issuedAt,
    exp: issuedAt + TOKEN_TTL_SECONDS,
  }

  return [
    encodeSegment({ alg: 'none', typ: 'JWT' }),
    encodeSegment(payload),
    '',
  ].join('.')
}

export function readUserFromToken(token: string | null): AuthUser | null {
  if (!token) return null

  try {
    const [, payloadSegment] = token.split('.')
    const payload = decodeSegment<TokenPayload>(payloadSegment)

    if (typeof payload.exp !== 'number' || payload.exp <= Date.now() / 1000) {
      return null
    }

    return { username: payload.username, name: payload.name }
  } catch {
    return null
  }
}

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token && !readUserFromToken(token)) {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    return null
  }

  return token
}

export function login(username: string, password: string): string {
  const isValid =
    username.trim() === TEMPORARY_CREDENTIALS.username &&
    password === TEMPORARY_CREDENTIALS.password

  if (!isValid) {
    throw new Error('Usuário ou senha inválidos.')
  }

  const token = createToken({ username: 'admin', name: 'Administrador' })
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
  return token
}

export function logout(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
