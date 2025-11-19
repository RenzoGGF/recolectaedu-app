export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  name: string;
  university?: string | null;
}
