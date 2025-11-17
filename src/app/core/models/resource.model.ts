export type ResourceType = 'Apuntes' | 'Practicas' | 'Ejercicios' | 'Otros';
export type ResourceFormat = 'TEXTO' | 'ENLACE' | 'ARCHIVO';
export type FormatoRecurso = 'ARCHIVO' | 'ENLACE' | 'TEXTO';
export type Tipo_recurso = 'Apuntes' | 'Practicas' | 'Ejercicios' | 'Otros';

export interface Resource {
  id_recurso: number;
  titulo: string;
  descripcion: string;
  contenido: string;
  formato: ResourceFormat;
  tipo: ResourceType;
  creado_el: string;
  id_usuario: number;
  id_curso: number;
  autorNombre: string;

  nombreCurso?: string;
  nombreUniversidad?: string;
}

export interface SearchResourceParams {
  keyword?: string;
  cursoId?: number;
  tipo?: string;
  autor?: string;
  universidad?: string;
  ordenarPor?: string;
}

export interface RecursoValoradoResponse {
  id_recurso: number;
  titulo: string;
  descripcion: string;
  ano: number;
  periodo: number;
  votos_utiles: number;
  votos_no_utiles: number,
  votos_netos: number,
  actualizado_el: string;
}

