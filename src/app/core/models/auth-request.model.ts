// src/app/core/models/auth-request.model.ts

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  rol?: string | null;
  perfil?: {
    nombre: string;
    apellidos: string;
    universidad: string;
    carrera: string;
    ciclo: number;
  } | null;
}
