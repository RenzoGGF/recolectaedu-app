// src/app/core/models/aporte.model.ts
// REEMPLAZAR TODO EL CONTENIDO:

export interface Aporte {
  id: number;
  titulo: string;
  tipo: TipoRecurso;
  cursoId: number;
  cursoNombre: string;
  universidad: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  votosPositivos: number;
  votosNegativos: number;
  comentarios: number;
}

// Usar los mismos valores que el backend
export type TipoRecurso = 'Apuntes' | 'Practicas' | 'Ejercicios' | 'Otros';

export interface RespuestaPagina<T> {
  contenido: T[];
  pagina: number;
  tamanio: number;
  totalElementos: number;
  totalPaginas: number;
  ultimo: boolean;
}

export interface AportesParams {
  usuarioId: number;
  cursoId?: number;
  tipo?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

// Solo los tipos que existen en el backend
export const TIPOS_RECURSO_FILTRO = [
  { value: '', label: 'Todos' },
  { value: 'Apuntes', label: 'Apuntes' },
  { value: 'Practicas', label: 'Prácticas' },
  { value: 'Ejercicios', label: 'Ejercicios' },
  { value: 'Otros', label: 'Otros' }
];

export const ORDENAMIENTO_OPCIONES = [
  { value: 'creado_el,desc', label: 'Más recientes' },
  { value: 'creado_el,asc', label: 'Más antiguos' },
  { value: 'titulo,asc', label: 'Título (A-Z)' },
  { value: 'titulo,desc', label: 'Título (Z-A)' }
];

// Solo los tipos que existen
export function getTipoIniciales(tipo: TipoRecurso): string {
  const iniciales: Record<TipoRecurso, string> = {
    'Apuntes': 'APT',
    'Practicas': 'PRC',
    'Ejercicios': 'EJR',
    'Otros': 'OTR'
  };
  return iniciales[tipo] || 'OTR';
}

// Helper para formato de archivo
export function getFormatoLabel(formato: string): string {
  const formatos: Record<string, string> = {
    'ARCHIVO': 'PDF',
    'ENLACE': 'ENLACE',
    'TEXTO': 'TEXTO'
  };
  return formatos[formato] || 'DOC';
}