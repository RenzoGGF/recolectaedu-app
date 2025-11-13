import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent],
  template: `
    <aside class="sidebar-container">

      <div class="profile-section">
        <div class="profile-icon-wrapper">
          <div class="profile-icon">
            <fa-icon [icon]="iconUser"></fa-icon>
          </div>
        </div>
        <span class="profile-name">Usuario</span>
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
        <a [routerLink]="['/mis-aportes']" class="nav-link">Mis Aportes</a>
      </nav>

      <div class="action-section">
        <a [routerLink]="['/upload']" class="btn-upload">
          <fa-icon [icon]="iconPlus"></fa-icon>
          Subir Recurso
        </a>
      </div>

    </aside>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 300px;
      font-family: 'Poppins', sans-serif;

      /* CAMBIO 2: ¡LA MAGIA!
         Se "pegará" a 100px desde el top cuando hagas scroll,
         pero se quedará dentro de su columna.
      */
      position: sticky;
      top: 100px; /* 80px de navbar + 20px de espacio */
    }

    .sidebar-container {
      /* CAMBIO 3: Fondo BLANCO y sombra */
      background-color: #FFFFFF;
      border-radius: 12px;
      padding: 25px 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    /* CAMBIO 4: Perfil (basado en tu imagen deseada) */
    .profile-section {
      display: flex;
      flex-direction: column; /* Apilado vertical */
      align-items: center; /* Centrado */
      gap: 10px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E7E7EE;
    }
    .profile-icon-wrapper {
      /* Contenedor para el ícono */
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background-color: #E5DFFF; /* Morado claro */
      display: grid;
      place-items: center;
    }
    .profile-icon {
      color: #240334; /* Ícono morado oscuro */
      font-size: 1.3rem;
    }
    .profile-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0D8EFF; /* ¡Color AZUL! */
    }

    /* Estadísticas */
    .stats-section {
      display: flex;
      justify-content: space-around;
      text-align: center;
      padding: 20px 0;
      border-bottom: 1px solid #E7E7EE;
    }
    .stat-item strong {
      display: block;
      font-size: 1.25rem;
      font-weight: 700;
      color: #000;
    }
    .stat-item span {
      font-size: 0.9rem;
      font-weight: 600;
      color: #555;
    }

    /* Navegación */
    .nav-section {
      display: flex;
      flex-direction: column;
      gap: 15px;
      padding: 20px 0;
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

    /* Botón de Subir */
    .action-section {
      margin-top: 10px;
    }
    .btn-upload {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 50px;
      background-color: #0D8EFF;
      color: #FFFFFF;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
    }
    .btn-upload:hover {
      background-color: #0056b3;
    }
  `]
})
export class UserSidebar {
  iconUser = faUser;
  iconPlus = faPlus;
}
