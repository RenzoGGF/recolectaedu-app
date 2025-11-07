export interface UsuarioRequest {
    email:string;
    password:string;
    rol:string;
    //perfil:?
}

export interface UsuarioResponse {
    id_usuario:number;
    email:string;
    role:string;
    //profile:?
}