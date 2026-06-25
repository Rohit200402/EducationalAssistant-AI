export interface LoginRequest { email: string; password: string; }
export interface RegisterRequest { firstName: string; lastName: string; displayName: string; email: string; userName: string; password: string; confirmPassword: string; institution: string; grade: string; preferredLanguage: string; }
export interface AuthResponse { token: string; expiration: string; userId: string; email: string; displayName: string; roles: string[]; }
