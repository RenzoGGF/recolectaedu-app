
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
  id: number;
  nombreAutor: string;
  apellidoAutor: string;
  tiempo: string;
  contenido: string;
}
