// src/app/features/recursos/pages/historial-aportes/historial-aportes.component.ts
// REEMPLAZAR TODO EL CONTENIDO DEL ARCHIVO CON ESTO:

import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  Aporte,
  RespuestaPagina,
  TIPOS_RECURSO_FILTRO,
  ORDENAMIENTO_OPCIONES,
  getTipoIniciales
} from '../../../../core/models/aporte.model';
import { HttpErrorResponse } from '@angular/common/http';
import { UsuarioStats } from '../../../../core/models/usuario-stats.model';
import {ResourceService} from '../../../../core/services/resource.service';

@Component({
  selector: 'app-historial-aportes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './historial-aportes.component.html',
  styleUrl: './historial-aportes.component.css'
})
export class HistorialAportesComponent implements OnInit {
  // ⭐ Services - DECLARAR SOLO UNA VEZ
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly resourceService = inject(ResourceService);

  // ⭐ Signals para estado
  aportes = signal<Aporte[]>([]);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  userStats = signal<UsuarioStats | null>(null);

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
  currentUserId = signal<number | null>(null);

  // Computed
  hasAportes = computed(() => this.aportes().length > 0);
  isEmpty = computed(() => !this.loading() && this.aportes().length === 0);

  //  Helpers para template
  getTipoIniciales = getTipoIniciales;

  async ngOnInit(): Promise<void> {
      //  NUEVO: Obtener userId y validar ANTES de cargar datos
      const userId = await this.authService.getUserId();
      
      if (!userId) {
        this.errorMessage.set('No se pudo obtener tu identificación. Por favor, inicia sesión nuevamente.');
        console.error('❌ No hay userId en AuthService');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
        return;
      }
      
      console.log('✅ Usuario autenticado con ID:', userId);
      this.currentUserId.set(userId);
      
      this.loadAportes();
      this.loadUserStats();
    }

  loadAportes(): void {
      //  CAMBIO: Obtener userId del signal
      const userId = this.currentUserId();
      
      if (!userId) {
        this.errorMessage.set('Usuario no autenticado');
        return;
      }
      
      this.loading.set(true);
      this.errorMessage.set(null);

      const sortArray = this.ordenamiento().split(',');

      this.usuarioService.getAportes({
        usuarioId: userId, // ✅ Usar el ID del signal
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
          console.log('✅ Aportes cargados:', response.contenido.length);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error al cargar aportes:', error);
          
          if (error.status === 500) {
            this.errorMessage.set('Error del servidor. Por favor, contacta al equipo de soporte.');
          } else if (error.status === 404) {
            this.errorMessage.set('Usuario no encontrado.');
          } else if (error.status === 401 || error.status === 403) {
            this.errorMessage.set('Sesión expirada. Redirigiendo al login...');
            setTimeout(() => this.router.navigate(['/auth/login']), 2000);
          } else {
            this.errorMessage.set('Error al cargar tus aportes. Intenta nuevamente.');
          }
          
          this.loading.set(false);
        }
      });
    }

    private loadUserStats(): void {
      //  CAMBIO: Obtener userId del signal
      const userId = this.currentUserId();
      
      if (!userId) {
        console.warn('⚠️ No se puede cargar stats sin userId');
        return;
      }
      
      this.usuarioService.getUserStats(userId).subscribe({
        next: (stats) => {
          this.userStats.set(stats);
          console.log('✅ Estadísticas cargadas:', stats);
        },
        error: (error: HttpErrorResponse) => {
          console.error('❌ Error al cargar estadísticas:', error);
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

  //  AGREGAR ESTA FUNCIÓN si la usas en el HTML
  getFormatoLabel(formato: string): string {
    const labels: Record<string, string> = {
      'ARCHIVO': 'Archivo',
      'ENLACE': 'Enlace',
      'TEXTO': 'Texto'
    };
    return labels[formato] || formato;
  }

  editarRecurso(id: number): void {
    console.log('Editar recurso:', id);
    this.router.navigate(['/recursos/editar', id]);
  }

  eliminarRecurso(id: number): void {
    console.log('Eliminar recurso:', id);
    if (!confirm('¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.')) {
      return;
    }

    // No ponemos loading
    // this.loading.set(true);

    this.resourceService.deleteResource(id).subscribe({
      next: () => {
        // Actualizar la lista localmente eliminando el item
        this.aportes.update(currentAportes =>
          currentAportes.filter(aporte => aporte.id !== id)
        );

        // Actualizar conteo
        this.totalElements.update(total => total - 1);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al eliminar:', error);
        alert('Ocurrió un error al intentar eliminar el recurso.');
      }
    });
  }

  irASubirRecurso(): void {
    this.router.navigate(['/recursos/publicar']);
  }
}
