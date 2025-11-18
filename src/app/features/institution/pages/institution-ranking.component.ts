// src/app/features/institution/pages/institution-ranking.component.ts

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../core/services/course.service';
import { CursoRanking } from '../../../core/models/ranking.model';

@Component({
  selector: 'app-institution-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="ranking-container">
      
      <!-- Header con botón volver -->
      <div class="ranking-header">
        <button class="btn-back" (click)="goBack()">
          ← Volver a Cursos
        </button>
        <h1 class="ranking-title">
          🏆 Ranking de {{ universityName() }}
        </h1>
        <p class="ranking-subtitle">
          Top 20 cursos con más aportes
        </p>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Cargando ranking...</p>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="error-state">
          <span class="error-icon">⚠️</span>
          <p>{{ errorMessage() }}</p>
          <button class="btn-retry" (click)="loadRanking()">
            Reintentar
          </button>
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && !errorMessage() && cursos().length === 0) {
        <div class="empty-state">
          <span class="empty-icon">📚</span>
          <h3>Esta universidad aún no tiene cursos con aportes</h3>
          <p>¡Sé el primero en contribuir!</p>
          <a routerLink="/recursos/publicar" class="btn-contribute">
            + Subir Recurso
          </a>
        </div>
      }

      <!-- Ranking List -->
      @if (!loading() && !errorMessage() && cursos().length > 0) {
        <div class="ranking-list">
          @for (curso of cursos(); track curso.idCurso; let idx = $index) {
            <div class="ranking-item" [class.top3]="getPosition(idx) <= 3">
              
              <!-- Posición -->
              <div class="ranking-position" 
                   [class.gold]="getPosition(idx) === 1" 
                   [class.silver]="getPosition(idx) === 2"
                   [class.bronze]="getPosition(idx) === 3">
                <span class="position-number">#{{ getPosition(idx) }}</span>
                @if (getPosition(idx) === 1) {
                  <span class="medal">🥇</span>
                }
                @if (getPosition(idx) === 2) {
                  <span class="medal">🥈</span>
                }
                @if (getPosition(idx) === 3) {
                  <span class="medal">🥉</span>
                }
              </div>

              <!-- Datos del Curso -->
              <div class="curso-info">
                <a [routerLink]="['/cursos', curso.idCurso]" class="curso-nombre">
                  {{ curso.nombre }}
                </a>
                <div class="curso-meta">
                  <span class="meta-item">
                    📖 {{ curso.carrera }}
                  </span>
                </div>
              </div>

              <!-- Contador de Aportes -->
              <div class="aportes-badge">
                <span class="aportes-count">{{ curso.aportesCount }}</span>
                <span class="aportes-label">aportes</span>
              </div>

              <!-- Botón Ver Curso -->
              <a 
                [routerLink]="['/cursos', curso.idCurso]" 
                class="btn-view-course"
              >
                Ver curso →
              </a>
            </div>
          }
        </div>

        <!-- Paginación -->
        @if (totalPages() > 1) {
          <div class="pagination">
            <button 
              class="btn-page"
              (click)="previousPage()"
              [disabled]="currentPage() === 0"
            >
              ← Anterior
            </button>
            
            <span class="page-info">
              Página {{ currentPage() + 1 }} de {{ totalPages() }}
            </span>
            
            <button 
              class="btn-page"
              (click)="nextPage()"
              [disabled]="isLastPage()"
            >
              Siguiente →
            </button>
          </div>
        }
      }

    </div>
  `,
  styles: [`
    .ranking-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 32px 20px;
    }

    /* Header */
    .ranking-header {
      text-align: center;
      margin-bottom: 40px;
      position: relative;
    }

    .btn-back {
      position: absolute;
      left: 0;
      top: 0;
      padding: 8px 16px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-back:hover {
      background: #f5f5f5;
    }

    .ranking-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 12px;
    }

    .ranking-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0;
    }

    /* Loading */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      gap: 16px;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #f3f3f3;
      border-top-color: #0D8EFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Error */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 60px 20px;
      gap: 16px;
    }

    .error-icon {
      font-size: 3rem;
    }

    .btn-retry {
      padding: 10px 24px;
      background: #0D8EFF;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Empty State */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 80px 20px;
      gap: 16px;
      background: white;
      border-radius: 12px;
    }

    .empty-icon {
      font-size: 4rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      margin: 0;
      color: #333;
    }

    .empty-state p {
      margin: 0;
      color: #666;
    }

    .btn-contribute {
      margin-top: 16px;
      padding: 12px 32px;
      background: #0D8EFF;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      transition: background 0.3s;
    }

    .btn-contribute:hover {
      background: #0b7ae0;
    }

    /* Ranking List */
    .ranking-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .ranking-item {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 20px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .ranking-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(0,0,0,0.12);
    }

    .ranking-item.top3 {
      border-left: 4px solid #FFD700;
    }

    /* Posición */
    .ranking-position {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 60px;
    }

    .position-number {
      font-size: 1.5rem;
      font-weight: 700;
      color: #666;
    }

    .ranking-position.gold .position-number {
      color: #FFD700;
    }

    .ranking-position.silver .position-number {
      color: #C0C0C0;
    }

    .ranking-position.bronze .position-number {
      color: #CD7F32;
    }

    .medal {
      font-size: 1.5rem;
    }

    /* Curso Info */
    .curso-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .curso-nombre {
      font-size: 1.2rem;
      font-weight: 600;
      color: #0D8EFF;
      text-decoration: none;
      transition: text-decoration 0.2s;
    }

    .curso-nombre:hover {
      text-decoration: underline;
    }

    .curso-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.9rem;
      color: #666;
    }

    /* Aportes Badge */
    .aportes-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: white;
    }

    .aportes-count {
      font-size: 1.8rem;
      font-weight: 700;
    }

    .aportes-label {
      font-size: 0.85rem;
      opacity: 0.9;
    }

    /* Botón Ver Curso */
    .btn-view-course {
      padding: 10px 20px;
      background: #0D8EFF;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.3s;
      white-space: nowrap;
    }

    .btn-view-course:hover {
      background: #0b7ae0;
    }

    /* Paginación */
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 32px;
      padding: 20px;
    }

    .btn-page {
      padding: 10px 20px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .btn-page:hover:not(:disabled) {
      background: #0D8EFF;
      color: white;
      border-color: #0D8EFF;
    }

    .btn-page:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-weight: 600;
      color: #666;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .ranking-item {
        flex-direction: column;
        text-align: center;
      }

      .btn-back {
        position: static;
        margin-bottom: 20px;
      }

      .btn-view-course {
        width: 100%;
      }
    }
  `]
})
export class InstitutionRankingComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  // Signals
  universityName = signal('');
  cursos = signal<CursoRanking[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  
  // Paginación
  currentPage = signal(0);
  pageSize = signal(20);
  totalElements = signal(0);
  totalPages = signal(0);
  isLastPage = signal(false);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const universidad = params['universidad'];
      if (universidad) {
        this.universityName.set(universidad);
        this.loadRanking();
      }
    });
  }

  loadRanking(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    this.courseService.getRankingCursos({
      universidad: this.universityName(),
      page: this.currentPage(),
      size: this.pageSize()
    }).subscribe({
      next: (response) => {
        this.cursos.set(response.content);
        this.currentPage.set(response.pageable.pageNumber);
        this.totalElements.set(response.totalElements);
        this.totalPages.set(response.totalPages);
        this.isLastPage.set(response.last);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar ranking:', error);
        this.errorMessage.set('Error al cargar el ranking. Intenta nuevamente.');
        this.loading.set(false);
      }
    });
  }

  getPosition(index: number): number {
    return (this.currentPage() * this.pageSize()) + index + 1;
  }

  nextPage(): void {
    if (!this.isLastPage()) {
      this.currentPage.update(p => p + 1);
      this.loadRanking();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update(p => p - 1);
      this.loadRanking();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  goBack(): void {
    this.router.navigate(['/instituciones', this.universityName()]);
  }
}