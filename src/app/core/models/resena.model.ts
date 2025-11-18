export interface ResenaResponse {
  id_resena: number;
  contenido: string;
  es_positivo: boolean;
  nombre_autor: string;
  titulo_recurso: string;
  creado_el: string;
  actualizado_el: string;
}

export interface ResenaCreateRequest {
  id_recurso: number;
  contenido: string;
  es_positivo: boolean;
}

export interface ResenaPartialUpdateRequest {
  contenido?: string | null;
  es_positivo?: boolean | null;
}
