// src/app/features/recursos/pages/historial-aportes/historial-aportes.component.ts
// CREAR NUEVO ARCHIVO

import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {UsuarioService} from '../../../../core/services/usuario.service';
import {
  Aporte,
  getFormatoLabel,
  getTipoIniciales,
  ORDENAMIENTO_OPCIONES,
  RespuestaPagina,
  TIPOS_RECURSO_FILTRO
} from '../../../../core/models/aporte.model';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-historial-aportes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historial-aportes.component.html',
  styleUrl: './historial-aportes.component.css'
})
export class HistorialAportesComponent implements OnInit {
  // Signals para estado
  aportes = signal<Aporte[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  // Paginación
  currentPage = signal(0);
  pageSize = signal(10);
  totalElements = signal(0);
  totalPages = signal(0);
  isLastPage = signal(false);
  // Filtros
  tipoFiltro = signal<string>('');
  ordenamiento = signal<string>('creado_el,desc');
  // Stats del usuario
  userStats = signal({
    totalSubidos: 0,
    totalVotos: 0,
    totalSeguidores: 0
  });
  // Opciones para dropdowns
  tiposRecurso = TIPOS_RECURSO_FILTRO;
  opcionesOrdenamiento = ORDENAMIENTO_OPCIONES;
  // Usuario actual (TODO: obtener del AuthService)
  currentUserId = 1;
  // Computed
  hasAportes = computed(() => this.aportes().length > 0);
  isEmpty = computed(() => !this.loading() && this.aportes().length === 0);
  // Helpers para template
  getTipoIniciales = getTipoIniciales;
  getFormatoLabel = getFormatoLabel;
  private readonly usuarioService = inject(UsuarioService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadAportes();
    this.loadUserStats();
  }

  loadAportes(): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const sortArray = this.ordenamiento().split(',');

    this.usuarioService.getAportes({
      usuarioId: this.currentUserId,
      tipo: this.tipoFiltro() || undefined,
      page: this.currentPage(),
      size: this.pageSize(),
      sort: sortArray
    }).subscribe({
      next: (response: RespuestaPagina<Aporte>) => {
        this.aportes.set(response.contenido);
        this.currentPage.set(response.pagina);
        this.pageSize.set(response.tamanio);
        this.totalElements.set(response.totalElementos);
        this.totalPages.set(response.totalPaginas);
        this.isLastPage.set(response.ultimo);
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar aportes:', error);
        this.errorMessage.set('Error al cargar tus aportes. Intenta nuevamente.');
        this.loading.set(false);
      }
    });
  }

  onTipoChange(): void {
    this.currentPage.set(0);
    this.loadAportes();
  }

  onOrdenamientoChange(): void {
    this.currentPage.set(0);
    this.loadAportes();
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages()) {
      this.currentPage.set(page);
      this.loadAportes();
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
  }

  nextPage(): void {
    if (!this.isLastPage()) {
      this.goToPage(this.currentPage() + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.goToPage(this.currentPage() - 1);
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAcademicYear(fechaCreacion: string): string {
    const year = new Date(fechaCreacion).getFullYear();
    return `${year}/${year + 1}`;
  }

  // Navegación (para cuando implementen editar/eliminar)
  editarRecurso(id: number): void {
    // TODO: Implementar cuando tengan la página de editar
    console.log('Editar recurso:', id);
    this.router.navigate(['/recursos/editar', id]);
  }

  eliminarRecurso(id: number): void {
    // TODO: Implementar cuando tengan el servicio de eliminar
    console.log('Eliminar recurso:', id);
  }

  irASubirRecurso(): void {
    this.router.navigate(['/recursos/publicar']);
  }

  private loadUserStats(): void {
    this.usuarioService.getUserStats(this.currentUserId).subscribe({
      next: (stats) => {
        this.userStats.set(stats);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar estadísticas:', error);
      }
    });
  }
}
