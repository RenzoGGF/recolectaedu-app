import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-profile-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="profile-wrapper">
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
              <span><strong>{{ followers }}</strong> Seguidores</span>
              <span><strong>{{ following }}</strong> Siguiendo</span>
              <span><strong>{{ uploads }}</strong> Recursos Subidos</span>
              <span><strong>{{ votes }}</strong> Votos recibidos</span>
              <span><strong>{{ comments }}</strong> Comentarios</span>
            </div>
          </div>

          <div class="profile-avatar-block">
            <div class="avatar-circle">
              <span class="avatar-icon">👤</span>
            </div>
            <button type="button" class="btn-edit">
              Editar Perfil
            </button>
          </div>
        </header>

        <section class="profile-body">
          <div class="section">
            <h2 class="section-title">Mis estadísticas</h2>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-value">{{ uploads }}</span>
                <span class="stat-label">Recursos Subidos</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ votes }}</span>
                <span class="stat-label">Votos recibidos</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ comments }}</span>
                <span class="stat-label">Comentarios</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h2 class="section-title">Insignias</h2>
            <p class="level-line">
              Nivel [0] <span class="badge-role">Lector</span>
            </p>
            <p class="level-progress">
              ¡Consigue [50] puntos más para subir de nivel!
            </p>

            <button type="button" class="btn-primary">
              VER BIBLIOTECA DEL USUARIO
            </button>
          </div>

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
    </div>
  `,
  styles: [`
    .profile-wrapper {
      max-width: 960px;
      margin: 0 auto;
    }

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

    .btn-edit:hover {
      background-color: #06a532;
    }

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

    .stats-row {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
    }

    .stat-item {
      min-width: 120px;
    }

    .stat-value {
      display: block;
      font-size: 18px;
      font-weight: 700;
      color: #000000;
    }

    .stat-label {
      font-size: 13px;
      color: #555555;
    }

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
    }

    .btn-secondary:hover {
      background-color: #0065cf;
    }

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
    }
  `]
})
export class UserProfilePageComponent {
  constructor(private authService: AuthService) {}

  userName = computed(() => this.authService.getUserName());
  userUniversity = computed(() => this.authService.getUserUniversity());

  // Mock por ahora; luego se conectan al backend
  followers = 0;
  following = 0;
  uploads = 0;
  votes = 0;
  comments = 0;
}
