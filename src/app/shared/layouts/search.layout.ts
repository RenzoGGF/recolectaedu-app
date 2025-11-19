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
      background-color: #f8f7fB;
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
      z-index: 100;
    }

    .layout-main-content {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: 30px;
      max-width: 220vh;
      padding: 40px 20px;
      flex: 1;
      align-items: start;
    }

    .main-content-area {
    }

    .sidebar-area {
      position: sticky;
      top: 110px;
      z-index: 1;
    }

    .layout-footer {
      position: relative;
      z-index: 2;
    }
  `]
})
export class SearchLayoutComponent { }
