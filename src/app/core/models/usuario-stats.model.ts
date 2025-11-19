// src/app/core/models/usuario-stats.model.ts
// CREAR NUEVO ARCHIVO

export interface UsuarioStats {
  totalRecursosPublicados: number;
  totalComentariosRealizados: number;
  totalResenasRecibidas: number;
  totalResenasPositivas: number;
  totalResenasNegativas: number;
  totalItemsBiblioteca: number;
}

// Helper para cuando todas las stats son 0
export function isEmptyStats(stats: UsuarioStats): boolean {
  return stats.totalRecursosPublicados === 0 &&
         stats.totalComentariosRealizados === 0 &&
         stats.totalResenasRecibidas === 0 &&
         stats.totalItemsBiblioteca === 0;
}