
export interface Resource {
  id_recurso: number;
  titulo: string;
  descripcion: string;
  contenido: string;
  formato: string;
  tipo: string;
  creado_el: string;
  id_usuario: number;
  id_curso: number;
  autorNombre: string;
}


export interface SearchResourceParams {
  keyword?: string;
  cursoId?: number;
  tipo?: string;
  autor?: string;
  universidad?: string;
  ordenarPor?: string;
}
