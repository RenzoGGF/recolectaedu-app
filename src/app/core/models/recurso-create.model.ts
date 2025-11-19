// src/app/core/models/recurso-create.model.ts
// CREAR NUEVO ARCHIVO

import { FormatoRecurso, Tipo_recurso } from './resource.model';

export interface RecursoCreateRequest {
  id_usuario: number;
  universidad: string;
  carrera: string;
  nombreCurso: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  formato: FormatoRecurso;
  tipo: Tipo_recurso;
  ano: number;
  periodo: number; // 0=verano, 1=primero, 2=segundo
}

export interface RecursoArchivoCreateRequest {
  id_usuario: number;
  universidad: string;
  carrera: string;
  nombreCurso: string;
  titulo: string;
  descripcion: string;
  formato: FormatoRecurso;
  tipo: Tipo_recurso;
  ano: number;
  periodo: number;
}

export type PeriodoAcademico = 0 | 1 | 2;

export const PERIODOS_ACADEMICOS = [
  { value: 0, label: 'Verano' },
  { value: 1, label: 'Primer Periodo' },
  { value: 2, label: 'Segundo Periodo' }
];

export const TIPOS_RECURSO = [
  { value: 'Apuntes', label: 'Apuntes' },
  { value: 'Practicas', label: 'Prácticas' },
  { value: 'Ejercicios', label: 'Ejercicios' },
  { value: 'Otros', label: 'Otros' }
];

export const FORMATOS_RECURSO = {
  ARCHIVO: 'ARCHIVO' as const,
  ENLACE: 'ENLACE' as const,
  TEXTO: 'TEXTO' as const
};

export const MAX_FILE_SIZE_MB = 20;
export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx'];