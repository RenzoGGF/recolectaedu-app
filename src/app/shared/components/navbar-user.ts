import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar-user',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, ReactiveFormsModule],
  template: `
    <nav class="navbar-container">

      <div class="navbar-left">
        <a [routerLink]="['/']" class="logo-link">
          <img src="logo.png" alt="Logo RecolectaEdu" class="logo-img">
          <span>RecolectaEdu</span>
        </a>
      </div>

      <form class="navbar-search" [formGroup]="searchForm" (ngSubmit)="onSearch()">

        <button type="submit" class="search-icon-button">
          <fa-icon [icon]="iconSearch" class="search-icon"></fa-icon>
        </button>

        <input
          type="text"
          placeholder="Busca documentos"
          formControlName="keyword">
      </form>

      <div class="navbar-right">
        <a [routerLink]="['/instituciones']" class="nav-link">Instituciones Educativas</a>

        @if (authService.isAuthenticated()) {
          <a [routerLink]="['/premium']" class="nav-link-premium">Premium</a>
          <a [routerLink]="['/profile']" class="nav-link-user">Usuario</a>
        } @else {
          <a [routerLink]="['/auth/login']" class="btn btn-login">
            Iniciar sesión
          </a>
        }
      </div>

    </nav>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      font-family: 'Poppins', sans-serif;
    }

    .navbar-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #240334;
      color: #FFFFFF;
      padding: 10px 40px;
      height: 70px;
    }

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: #FFFFFF;
      font-size: 24px;
      font-weight: 700;
    }
    .logo-img {
      height: 45px;
      margin-right: 10px;
    }

    .navbar-search {
      position: relative;
      flex-grow: 1;
      max-width: 500px;
      margin: 0 40px;
      display: flex;
    }

    .search-icon-button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #8A8A8A;
      cursor: pointer;
    }
    .search-icon {
      font-size: 1rem;
    }

    .navbar-search input {
      width: 100%;
      padding: 12px 20px 12px 45px;
      border: none;
      border-radius: 50px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 14px;
      background-color: #FFFFFF;
    }

    .navbar-right {
      display: flex;
      align-items: center;
      gap: 30px;
    }
    .nav-link {
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      white-space: nowrap;
    }
    .nav-link:hover {
      text-decoration: underline;
    }
    .nav-link-premium {
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .nav-link-premium:hover {
      text-decoration: underline;
    }
    .nav-link-user {
      color: #0D8EFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }
    .nav-link-user:hover {
      text-decoration: underline;
    }
    .btn {
      padding: 10px 24px;
      border: none;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-login {
      background-color: #32CD32;
      color: #FFFFFF;
    }
    .btn-login:hover {
      background-color: #228B22;
    }
  `]
})
export class NavbarUserComponent {
  iconSearch = faSearch;

  private fb = inject(FormBuilder);
  private router = inject(Router);

  searchForm: FormGroup;

  constructor(public authService: AuthService) {
    this.searchForm = this.fb.group({
      keyword: ['']
    });
  }

  onSearch(): void {
    const keyword = this.searchForm.value.keyword;

    if (keyword) {
      console.log('Buscando desde el navbar:', keyword);

      this.router.navigate(['/search'], {
        queryParams: {
          keyword: keyword
        }
      });
      this.searchForm.reset();
    }
  }
}
