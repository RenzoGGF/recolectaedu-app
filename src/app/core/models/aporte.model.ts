// src/app/core/models/aporte.model.ts
// HISTORIAL APORTES POR USUARIO

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

export type TipoRecurso = 'APUNTES' | 'PRACTICAS' | 'EJERCICIOS' | 'LIBROS' | 'ENLACES' | 'GUIAS' | 'OTROS';

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

// Constantes para filtros
export const TIPOS_RECURSO_FILTRO = [
  { value: '', label: 'Todos' },
  { value: 'APUNTES', label: 'Apuntes' },
  { value: 'PRACTICAS', label: 'Prácticas' },
  { value: 'EJERCICIOS', label: 'Ejercicios' },
  { value: 'LIBROS', label: 'Libros' },
  { value: 'ENLACES', label: 'Enlaces' },
  { value: 'GUIAS', label: 'Guías' },
  { value: 'OTROS', label: 'Otros' }
];

export const ORDENAMIENTO_OPCIONES = [
  { value: 'creado_el,desc', label: 'Más recientes' },
  { value: 'creado_el,asc', label: 'Más antiguos' },
  { value: 'titulo,asc', label: 'Título (A-Z)' },
  { value: 'titulo,desc', label: 'Título (Z-A)' }
];

// Helper para obtener iniciales del tipo
export function getTipoIniciales(tipo: TipoRecurso): string {
  const iniciales: Record<TipoRecurso, string> = {
    'APUNTES': 'APT',
    'PRACTICAS': 'PRC',
    'EJERCICIOS': 'EJR',
    'LIBROS': 'LIB',
    'ENLACES': 'ENL',
    'GUIAS': 'GUI',
    'OTROS': 'OTR'
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