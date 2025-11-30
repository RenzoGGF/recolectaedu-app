import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { CourseService } from '../../../core/services/course.service';
import { UniversityCourseCount } from '../../../core/models/university.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-institution-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, FormsModule],
  template: `
    <div class="inst-list-container">

      <div class="header-section">
        <h1>¿Quieres un material de una institución<br>educativa en específico?</h1>

        <div class="search-box">
          <input
            type="text"
            placeholder="Escribe para iniciar la búsqueda"
            [(ngModel)]="searchTerm"
          >
          <fa-icon [icon]="iconSearch" class="search-icon"></fa-icon>
        </div>
      </div>

      <div class="universities-card">
        <h2>Universidades</h2>

        <div class="universities-grid">
          @for (uni of filteredUniversities(); track uni.universidad) {
            <a [routerLink]="['/instituciones', uni.universidad]" class="uni-row">
              <span class="uni-name">{{ uni.universidad }}</span>
              <span class="uni-count">¡{{ uni.cantidadCursos }} cursos disponibles!</span>
            </a>
          } @empty {
            <p class="empty-msg">No se encontraron instituciones.</p>
          }
        </div>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      background-color: #EBEBF2;
      min-height: 100vh;
      padding-bottom: 40px;
      font-family: 'Poppins', sans-serif;
    }

    .inst-list-container {
      max-width: 1000px;
      margin: -50px auto;

      padding : 40px 20px 0 20px;
      text-align: center;
    }

    .header-section h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 20px;
      line-height: 1.3;
    }

    .search-box {
      position: relative;
      max-width: 600px;
      margin: 0 auto 40px auto;
    }
    .search-box input {
      width: 100%;
      padding: 15px 45px 15px 20px;
      border-radius: 50px;
      border: none;
      background-color: #FFFFFF;
      font-size: 1rem;
      outline: none;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .search-icon {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      color: #000;
      font-size: 1.2rem;
    }

    .universities-card {
      background-color: #FFFFFF;
      border-radius: 20px;
      padding: 30px 50px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    }
    .universities-card h2 {
      font-size: 1.3rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 30px;
      text-align: center;
    }

    .universities-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 60px;
      row-gap: 15px;
      text-align: left;
    }

    .uni-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      padding: 5px 0;
    }
    .uni-row:hover .uni-name {
      text-decoration: underline;
    }

    .uni-name {
      font-weight: 600;
      color: #0099FF;
      font-size: 1rem;
    }
    .uni-count {
      font-weight: 700;
      color: #000;
      font-size: 0.9rem;
      white-space: nowrap;
    }

    .empty-msg {
      grid-column: 1 / -1;
      text-align: center;
      color: #555;
      margin-top: 20px;
    }

    @media (max-width: 768px) {
      .universities-grid {
        grid-template-columns: 1fr;
      }
      .universities-card {
        padding: 30px 20px;
      }
    }
  `]
})
export class InstitutionListComponent implements OnInit {
  iconSearch = faSearch;

  private courseService = inject(CourseService);

  allUniversities = signal<UniversityCourseCount[]>([]);
  searchTerm = signal('');

  filteredUniversities = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.allUniversities().filter(uni =>
      uni.universidad.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    this.courseService.getUniversitiesWithCourseCount().subscribe({
      next: (data) => this.allUniversities.set(data),
      error: (err) => console.error('Error cargando universidades', err)
    });
  }
}
