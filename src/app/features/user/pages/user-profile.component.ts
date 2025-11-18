// src/app/features/user/pages/user-profile.component.ts
// REEMPLAZAR TODO EL ARCHIVO:

import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UsuarioStats } from '../../../core/models/usuario-stats.model';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-wrapper">
      
      <!-- Loading State -->
      @if (loading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Cargando perfil...</p>
        </div>
      }

      <!-- Error State -->
      @if (errorMessage()) {
        <div class="error-container">
          <span class="error-icon">⚠️</span>
          <p>{{ errorMessage() }}</p>
          <button class="btn-retry" (click)="loadStats()">
            Reintentar
          </button>
        </div>
      }

      <!-- Contenido Principal -->
      @if (!loading() && !errorMessage()) {
        <section class="profile-card">

          <header class="profile-header">
            <div class="profile-title-block">
              <h1 class="user-name">
                {{ userName() || 'Tus nombres y apellidos' }}
              </h1>
              <a class="user-university" href="#">
                {{ userUniversity() || 'La Universidad en la que estudias' }}
              </a>

              <div class="follow-stats">
                <span><strong>{{ stats()?.totalRecursosPublicados || 0 }}</strong> Recursos Subidos</span>
                <span><strong>{{ stats()?.totalResenasRecibidas || 0 }}</strong> Votos recibidos</span>
                <span><strong>{{ stats()?.totalComentariosRealizados || 0 }}</strong> Comentarios</span>
                <span><strong>{{ stats()?.totalItemsBiblioteca || 0 }}</strong> En Biblioteca</span>
              </div>
            </div>

            <div class="profile-avatar-block">
              <div class="avatar-circle">
                <span class="avatar-icon">👤</span>
              </div>
              <button type="button" class="btn-edit" disabled title="Funcionalidad en desarrollo">
                Editar Perfil
              </button>
            </div>
          </header>

          <section class="profile-body">
            <!-- Sección: Mis estadísticas -->
            <div class="section">
              <h2 class="section-title">Mis estadísticas</h2>
              
              <div class="stats-row">
                <div class="stat-item">
                  <span class="stat-value">{{ stats()?.totalRecursosPublicados || 0 }}</span>
                  <span class="stat-label">Recursos Subidos</span>
                </div>
                
                <div class="stat-item">
                  <span class="stat-value">{{ stats()?.totalResenasRecibidas || 0 }}</span>
                  <span class="stat-label">Votos recibidos (total)</span>
                </div>
                
                <div class="stat-item">
                  <span class="stat-value">{{ stats()?.totalComentariosRealizados || 0 }}</span>
                  <span class="stat-label">Comentarios realizados</span>
                </div>
              </div>

              <!-- Desglose de votos -->
              <div class="votes-breakdown">
                <div class="vote-detail">
                  <span class="vote-icon positive">👍</span>
                  <span class="vote-count">{{ stats()?.totalResenasPositivas || 0 }}</span>
                  <span class="vote-label">Votos positivos</span>
                </div>
                <div class="vote-detail">
                  <span class="vote-icon negative">👎</span>
                  <span class="vote-count">{{ stats()?.totalResenasNegativas || 0 }}</span>
                  <span class="vote-label">Votos negativos</span>
                </div>
              </div>

              <!-- Biblioteca personal -->
              <div class="biblioteca-stat">
                <span class="biblioteca-icon">📚</span>
                <span class="biblioteca-count">{{ stats()?.totalItemsBiblioteca || 0 }}</span>
                <span class="biblioteca-label">recursos en tu biblioteca personal</span>
              </div>
            </div>

            <!-- Sección: Insignias (hardcoded por ahora) -->
            <div class="section">
              <h2 class="section-title">Insignias</h2>
              <p class="level-line">
                Nivel [0] <span class="badge-role">Lector</span>
              </p>
              <p class="level-progress">
                ¡Consigue [50] puntos más para subir de nivel!
              </p>

              <button type="button" class="btn-primary" [routerLink]="['/biblioteca']">
                VER BIBLIOTECA DEL USUARIO
              </button>
            </div>

            <!-- Sección: CTA para subir recursos -->
            <div class="section section-bottom">
              <p class="hint">
                ¡Consigue puntos subiendo recursos, así ayudarás a tus compañeros!
              </p>
              <button type="button" class="btn-secondary" [routerLink]="['/recursos/publicar']">
                + Subir Recurso
              </button>
            </div>
          </section>

        </section>
      }
    </div>
  `,
  styles: [`
    .profile-wrapper {
      max-width: 960px;
      margin: 0 auto;
      padding: 20px;
    }

    /* ==================== Loading State ==================== */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 2rem;
      gap: 1.5rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e9ecef;
      border-top-color: #0D8EFF;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      font-size: 1.1rem;
      color: #6c757d;
      font-weight: 500;
    }

    /* ==================== Error State ==================== */
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 3rem 2rem;
      gap: 1rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .error-icon {
      font-size: 3rem;
    }

    .error-container p {
      font-size: 1rem;
      color: #c33;
      font-weight: 600;
      margin: 0;
    }

    .btn-retry {
      padding: 0.75rem 1.5rem;
      background-color: #0D8EFF;
      color: white;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-retry:hover {
      background-color: #0b7ae0;
    }

    /* ==================== Profile Card ==================== */
    .profile-card {
      background-color: #ffffff;
      border-radius: 24px;
      padding: 24px 28px 26px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
      font-family: 'Poppins', sans-serif;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid #e5e5f0;
      padding-bottom: 18px;
      margin-bottom: 18px;
    }

    .profile-title-block {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .user-name {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
      color: #000000;
    }

    .user-university {
      font-size: 14px;
      font-weight: 600;
      color: #0d8eff;
      text-decoration: none;
    }

    .user-university:hover {
      text-decoration: underline;
    }

    .follow-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 6px;
      font-size: 13px;
      color: #333333;
    }

    .follow-stats strong {
      font-weight: 700;
    }

    .profile-avatar-block {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .avatar-circle {
      width: 74px;
      height: 74px;
      border-radius: 50%;
      background: linear-gradient(135deg, #f1e5ff, #e3f0ff);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .avatar-icon {
      font-size: 32px;
    }

    .btn-edit {
      padding: 6px 14px;
      border-radius: 999px;
      border: none;
      background-color: #00c43b;
      color: #ffffff;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-edit:hover:not(:disabled) {
      background-color: #06a532;
    }

    .btn-edit:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ==================== Profile Body ==================== */
    .profile-body {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .section {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .section-title {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      color: #000000;
    }

    /* ==================== Stats Row ==================== */
    .stats-row {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
    }

    .stat-item {
      min-width: 120px;
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      display: block;
      font-size: 28px;
      font-weight: 700;
      color: #0D8EFF;
    }

    .stat-label {
      font-size: 13px;
      color: #555555;
      font-weight: 500;
    }

    /* ==================== Votos Breakdown ==================== */
    .votes-breakdown {
      display: flex;
      gap: 24px;
      margin-top: 12px;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 12px;
    }

    .vote-detail {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .vote-icon {
      font-size: 24px;
    }

    .vote-icon.positive {
      filter: drop-shadow(0 2px 4px rgba(40, 167, 69, 0.3));
    }

    .vote-icon.negative {
      filter: drop-shadow(0 2px 4px rgba(220, 53, 69, 0.3));
    }

    .vote-count {
      font-size: 20px;
      font-weight: 700;
      color: #000;
    }

    .vote-label {
      font-size: 13px;
      color: #666;
    }

    /* ==================== Biblioteca ==================== */
    .biblioteca-stat {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-top: 12px;
      padding: 12px;
      background-color: #e3f0ff;
      border-radius: 12px;
    }

    .biblioteca-icon {
      font-size: 28px;
    }

    .biblioteca-count {
      font-size: 24px;
      font-weight: 700;
      color: #0D8EFF;
    }

    .biblioteca-label {
      font-size: 14px;
      color: #333;
      font-weight: 500;
    }

    /* ==================== Insignias ==================== */
    .level-line {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }

    .badge-role {
      margin-left: 4px;
    }

    .level-progress {
      margin: 0;
      font-size: 13px;
      color: #444444;
    }

    /* ==================== Buttons ==================== */
    .btn-primary {
      align-self: flex-start;
      padding: 10px 24px;
      border-radius: 999px;
      border: none;
      background-color: #007bff;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-primary:hover {
      background-color: #0065cf;
    }

    .section-bottom {
      border-top: 1px solid #e5e5f0;
      padding-top: 12px;
    }

    .hint {
      margin: 0 0 6px;
      font-size: 13px;
      color: #333333;
    }

    .btn-secondary {
      padding: 9px 20px;
      border-radius: 999px;
      border: none;
      background-color: #007bff;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .btn-secondary:hover {
      background-color: #0065cf;
    }

    /* ==================== Responsive ==================== */
    @media (max-width: 900px) {
      .profile-card {
        padding: 20px 18px 22px;
        border-radius: 18px;
      }

      .profile-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .profile-avatar-block {
        flex-direction: row;
      }

      .votes-breakdown {
        flex-direction: column;
        gap: 12px;
      }

      .biblioteca-stat {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class UserProfilePageComponent implements OnInit {
  private authService = inject(AuthService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  // Signals
  stats = signal<UsuarioStats | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  // Computed
  userName = computed(() => this.authService.getUserName());
  userUniversity = computed(() => this.authService.getUserUniversity());

  ngOnInit(): void {
    // Verificar autenticación
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    this.loadStats();
  }

  loadStats(): void {
    const userId = this.authService.getUserId();
    
    if (!userId) {
      this.errorMessage.set('No se pudo obtener el ID del usuario.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.usuarioService.getUserStats(userId).subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
        console.log('✅ Estadísticas cargadas:', data);
      },
      error: (error) => {
        console.error('❌ Error al cargar estadísticas:', error);
        this.errorMessage.set('Error al cargar las estadísticas. Intenta nuevamente.');
        this.loading.set(false);
      }
    });
  }
}