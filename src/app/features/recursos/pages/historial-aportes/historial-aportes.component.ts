// src/app/features/recursos/pages/historial-aportes/historial-aportes.component.ts
// REEMPLAZAR las líneas relevantes:

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';
import { 
  Aporte, 
  RespuestaPagina,
  TIPOS_RECURSO_FILTRO,
  ORDENAMIENTO_OPCIONES,
  getTipoIniciales,
  getFormatoLabel
} from '../../../../core/models/aporte.model';

@Component({
  selector: 'app-historial-aportes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './historial-aportes.component.html',
  styleUrl: './historial-aportes.component.css'
})
export class HistorialAportesComponent implements OnInit {
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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
  
  // Opciones para dropdowns
  tiposRecurso = TIPOS_RECURSO_FILTRO;
  opcionesOrdenamiento = ORDENAMIENTO_OPCIONES;
  
  // Usuario actual
  currentUserId = this.authService.getUserId() || 1; // Fallback a 1
  
  // Computed
  hasAportes = computed(() => this.aportes().length > 0);
  isEmpty = computed(() => !this.loading() && this.aportes().length === 0);
  
  // Helpers para template
  getTipoIniciales = getTipoIniciales;
  getFormatoLabel = getFormatoLabel;

  ngOnInit(): void {
    this.loadAportes();
    // ⭐ NO cargar stats aquí - el sidebar lo hace
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
      error: (error) => {
        console.error('Error al cargar aportes:', error);
        
        if (error.status === 500) {
          this.errorMessage.set('Error del servidor. Por favor, contacta al equipo de backend.');
        } else if (error.status === 404) {
          this.errorMessage.set('Usuario no encontrado.');
        } else {
          this.errorMessage.set('Error al cargar tus aportes. Intenta nuevamente.');
        }
        
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  editarRecurso(id: number): void {
    console.log('Editar recurso:', id);
    this.router.navigate(['/recursos/editar', id]);
  }

  eliminarRecurso(id: number): void {
    console.log('Eliminar recurso:', id);
  }

  irASubirRecurso(): void {
    this.router.navigate(['/recursos/publicar']);
  }
}