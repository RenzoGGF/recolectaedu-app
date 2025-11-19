import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  template: `
    <aside class="sidebar-container">

      <div class="profile-section">
        <div class="profile-info">
          <fa-icon [icon]="iconUser" class="profile-icon"></fa-icon>
          <span class="user-name">{{ userName }}</span>
        </div>
      </div>

      <div class="stats-section">
        <div class="stat-item">
          <strong>0</strong>
          <span>Subidos</span>
        </div>
        <div class="stat-item">
          <strong>0</strong>
          <span>Votos</span>
        </div>
        <div class="stat-item">
          <strong>0</strong>
          <span>Seguidores</span>
        </div>
      </div>

      <nav class="nav-section">
        <a [routerLink]="['/']" class="nav-link">Página principal</a>
        <a [routerLink]="['/biblioteca']" class="nav-link">Biblioteca personal</a>
        <a [routerLink]="['/recursos/mis-aportes']" class="nav-link">Mis Aportes</a>
      </nav>

      <div class="action-section">
        <a [routerLink]="['/recursos/publicar']" class="btn-upload">
          <fa-icon [icon]="iconPlus"></fa-icon>
          Subir Recurso
        </a>
      </div>

    </aside>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 50px;
      right: 0;
      width: 300px;
      height: 100vh;
      background-color: #FFFFFF;
      box-shadow: -4px 0 20px rgba(0, 0, 0, 0.08);
      font-family: 'Poppins', sans-serif;
      z-index: 100;
      overflow-y: auto;
      padding: 30px 20px;
    }

    .profile-section {
      display: flex;
      justify-content: center;
      margin-top: 30px;
      margin-bottom: 25px;
    }

    .profile-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .profile-icon {
      font-size: 1.6rem;
      color: #240334;
      background-color: #E5DFFF;
      border-radius: 50%;
      padding: 10px;
    }

    .profile-name {
      font-size: 1.3rem;
      font-weight: 700;
      color: #0D8EFF;
    }

    .stats-section {
      display: flex;
      justify-content: space-around;
      text-align: center;
      padding: 15px 0;
      border-top: 1px solid #E7E7EE;
      border-bottom: 1px solid #E7E7EE;
    }
    .stat-item strong {
      display: block;
      font-size: 1.2rem;
      font-weight: 700;
      color: #000;
    }
    .stat-item span {
      font-size: 0.9rem;
      font-weight: 600;
      color: #555;
    }

    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 25px 0;
    }
    .nav-link {
      font-size: 1rem;
      font-weight: 600;
      color: #555;
      text-decoration: none;
    }
    .nav-link:hover {
      color: #0D8EFF;
    }

    .action-section {
      display: flex;
      justify-content: center;
      margin-top: 40px; 
    }

    .btn-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 150px;
      gap: 10px;
      width: 200px;
      padding: 12px;
      border: none;
      border-radius: 50px;
      background-color: #0D8EFF;
      color: #FFFFFF;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }

    .btn-upload:hover {
      background-color: #0056b3;
    }

    @media (min-width: 1024px) {
      body, .main-content {
        margin-right: 320px !important;
      }
    }
  `]
})
export class UserSidebar {
  private authService = inject(AuthService);
  
  iconUser = faUser;
  iconPlus = faPlus;

  get userName(): string {
    return this.authService.getUserName() || 'Usuario';
  }
}
