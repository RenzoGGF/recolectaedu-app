export interface UserProfile {
  id_usuario: number;
  email: string;
  role: string;
  profile: {
    id_usuario: number;
    nombre: string | null;
    apellidos: string | null;
    universidad: string | null;
    carrera: string | null;
    ciclo: number | null;
  } | null;
}
