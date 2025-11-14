export type ResourceType = 'Apuntes' | 'Practicas' | 'Ejercicios' | 'Otros';
export type ResourceFormat = 'TEXTO' | 'ENLACE' | 'ARCHIVO';


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
