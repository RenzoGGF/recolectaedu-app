
export interface ForoTopic {
  id_foro: number;
  titulo: string;
  contenido: string;
  creado_el: string;
  id_usuario: number;
  nombre: string;
  apellido: string;
  emailAutor: string;
}

export interface ForoTopicRequest {
  titulo: string;
  contenido: string;
}

export interface ForoComment {
  id_comentario: number;
  contenido: string;
  creado_el: string;
  nombreAutor: string;
  apellidoAutor: string;
  id_usuario: number;
  id_comentario_padre?: number;
}

export interface ForoCommentRequest {
  contenido: string;
  id_foro: number;
  id_comentario_padre?: number;
}
