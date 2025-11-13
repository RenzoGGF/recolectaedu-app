import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarUserComponent } from '../components/navbar-user'; 
import { FooterComponent } from '../components/footer';       
import { UserSidebar } from '../components/user-sidebar';     
@Component({
  selector: 'app-search-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarUserComponent,
    FooterComponent,
    UserSidebar
  ],
  template: `
    <div class="layout-container">
      <app-navbar-user class="layout-header" />

      <div class="layout-main-content">
        
        <main class="main-content-area">
          <router-outlet></router-outlet>
        </main>

        <aside class="sidebar-area">
          <app-user-sidebar />
        </aside>

      </div>

      <app-footer class="layout-footer" />
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #f8f7fB; /* Fondo gris claro */
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
    }

    .layout-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    .layout-header {
      position: sticky;
      top: 0;
      z-index: 100; /* Header por encima de todo */
    }

    .layout-main-content {
      display: grid;  
      /* Columna 1 (flexible) | Columna 2 (fija) */
      grid-template-columns: 1fr 300px;
      gap: 30px;
      max-width: 220vh;
      padding: 40px 20px; /* Espacio superior e inferior */
      flex: 1; 
      align-items: start;
    }

    .main-content-area {
      /* Aquí va la lista de resultados */
    }

    .sidebar-area {
      /* ¡AQUÍ ESTÁ LA SOLUCIÓN! */
      position: sticky;
      /* Tu navbar mide 70px + 40px de padding = 110px */
      top: 110px; 
      /* z-index: 1 para que el footer (z-index: 2) le pase por encima */
      z-index: 1;
    }

    .layout-footer {
      /* El footer debe tener z-index más alto que el sidebar */
      position: relative;
      z-index: 2;
    }
  `]
})
export class SearchLayoutComponent { }