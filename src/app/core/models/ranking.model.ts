// src/app/core/models/ranking.model.ts

export interface CursoRanking {
  idCurso: number;
  nombre: string;
  universidad: string;
  carrera: string;
  aportesCount: number;
}

export interface RankingResponse {
  content: CursoRanking[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  numberOfElements: number;
}