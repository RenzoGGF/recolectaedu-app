export interface BibliotecaResponse {
  id_biblioteca: number;
  nombre: string;
  id_usuario: number;
}

export interface BibliotecaRecursoResponse {
  id_biblioteca_recurso: number;
  titulo_recurso: string;
  id_recurso: number;
  agregado_el: string;
}
