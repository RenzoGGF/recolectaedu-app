import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGraduationCap, faSearch } from '@fortawesome/free-solid-svg-icons';
import { UniversityRanking } from '../../../core/models/university.model.js';
import { CourseService } from '../../../core/services/course.service.js';
import { AdvancedSearchComponent } from '../../search/components/advanced-search.component.ts';
import { SearchResourceParams } from '../../../core/models/resource.model';
import { catchError, of, tap } from 'rxjs';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FaIconComponent,
    ReactiveFormsModule,
    AdvancedSearchComponent
  ],
  template: `
    <section class="hero-section">
      <div class="container">
        <h1>Todo el<br> conocimiento<br>que necesitas<br>en un solo lugar.</h1>
        <p class="subtitle">Recolecta. Aprende. Crece.</p>

        <form class="search-block" [formGroup]="searchForm" (ngSubmit)="onSimpleSearch()">

          <div class="search-bar-container">
            <input
              type="text"
              class="search-main-input"
              placeholder="Busca documentos"
              formControlName="keyword">

            <div class="search-elements-inside">
              <select name="Tipo" class="search-select-inner" formControlName="tipo">
                <option value="">Tipo</option>
                <option value="Apuntes">Apuntes</option>
                <option value="Ejercicios">Ejercicios</option>
                <option value="Practicas">Practicas</option>
                <option value="Otros">Otros</option>
              </select>

              <input
                type="text"
                name="id_curso"
                class="search-input-inner"
                placeholder="ID Curso"
                formControlName="cursoId">

              <button type="submit" class="search-icon-button">
                <fa-icon [icon]="iconSearch" class="search-icon-inner"></fa-icon>
              </button>
            </div>
          </div>

          <button type="button" class="btn-advanced-search" (click)="onOpenAdvancedSearch()">
            Búsqueda<br>Avanzada
          </button>

        </form>
      </div>
    </section>

    <section class="universities-section">
      <div class="content-card">
        <h2 class="universities-title">Universidades</h2>
        <div class="pills-container">

          @for (uni of universities(); track uni.universidad) {
            <a [routerLink]="['/instituciones', uni.universidad]" class="pill">
              {{ uni.universidad }}
            </a>
          } @empty {
            <p>{{ universityLoadingMessage() }}</p>
          }

        </div>
      </div>
    </section>

    <section class="cta-section">
      <div class="container">
        <a [routerLink]="['/foro']" class="btn btn-forum">¡ENTRA AL FORO!</a>
        <h3>¡Comienza a subir recursos para ayudar a la comunidad!</h3>
        <p>Necesitas tener una cuenta para subir recursos</p>
        <a [routerLink]="['/upload']" class="btn btn-primary-blue">
          + SUBIR UN RECURSO
        </a>
      </div>
    </section>

    <section class="team-section">
      <div class="container">
        <h2>¡Nos encanta ayudar a todos los estudiantes!</h2>
        <p>¿Te interesa conocer al equipo detrás del desarrollo?</p>
        <div class="team-grid">
          <div class="team-member">
            <img src="team-carlos.png" alt="Carlos Molina">
            <strong>Carlos Alejandro<br>Molina Huatuco</strong>
          </div>
          <div class="team-member">
            <img src="team-sebastian.png" alt="Sebastián Luna">
            <strong>Sebastián Rodrigo<br>Luna Centeno</strong>
          </div>
          <div class="team-member">
            <img src="team-renzo.png" alt="Renzo Gutierrez">
            <strong>Renzo Gabriel<br>Gutierrez Fernandez</strong>
          </div>
          <div class="team-member">
            <img src="team-eduardo.png" alt="Eduardo Bravo">
            <strong>Eduardo Fernando<br>Bravo Lévano</strong>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <div class="faq-container">
        <h2>Preguntas Frecuentes:</h2>
        <div class="faq-list">
          <div class="faq-item">
            <strong>1. ¿Qué es RecolectaEdu?</strong>
            <p>RecolectaEdu es una plataforma comunitaria diseñada para que estudiantes, docentes y cualquier persona interesada pueda compartir y encontrar recursos académicos de manera sencilla. Piensa en ello como una biblioteca colaborativa donde todos pueden contribuir al conocimiento.</p>
          </div>
          <div class="faq-item">
            <strong>2. ¿Cómo puedo crear una cuenta?</strong>
            <p>Puedes registrarte de forma rápida y fácil usando tu cuenta de Google o Microsoft. Si prefieres, también puedes crear una cuenta con tu correo electrónico y una contraseña.</p>
          </div>
           <div class="faq-item">
            <strong>3. ¿Cómo subo un recurso?</strong>
            <p>Es muy simple. Solo haz clic en el botón "+ Subir Recurso". Luego, sube tu documento y completa los detalles necesarios como el título, la asignatura y la institución a la que pertenece.</p>
          </div>
          <div class="faq-item">
            <strong>4. ¿Qué tipo de documentos puedo subir?</strong>
            <p>Puedes subir una amplia variedad de recursos, incluyendo documentos en PDF, archivos de Word, presentaciones, apuntes de clase, guías de estudio y cualquier otro material educativo que consideres útil para la comunidad.</p>
          </div>
          <div class="faq-item">
            <strong>5. ¿Cómo encuentro recursos para mis clases?</strong>
            <p>Usa la barra de búsqueda en la parte superior para buscar por asignatura, tema o nombre del documento. También puedes navegar por las secciones de "Asignaturas" e "Instituciones Académicas" para explorar el contenido que ya está disponible.</p>
          </div>
          <div class="faq-item">
            <strong>6. ¿Puedo guardar documentos para verlos más tarde?</strong>
            <p>Sí. Cuando encuentres un recurso que te guste, puedes agregarlo a tu "biblioteca personal".</p>
          </div>
        </div>
        <div class="faq-contact">
          <h3>¿Tienes más preguntas o algún problema?</h3>
          <p>Contactanos escribiendo al correo: <strong>recolectaedu@gmail.com</strong></p>
        </div>
      </div>
    </section>

    @if (isAdvancedSearchOpen()) {
      <app-advanced-search
        (close)="onCloseAdvancedSearch()"
        (apply)="onApplyFilters($event)"
      />
    }
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      background-color: #FFFFFF;
      color: #240334;
      font-family: 'Poppins', sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 60px 20px;
      text-align: center;
    }

    .hero-section {
      background-color: #f8f7fB;
      padding-top: 40px;
      padding-bottom: 60px;
      text-align: center;
    }
    .hero-section h1 {
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 15px;
    }
    .hero-section .subtitle {
      font-size: 1.15rem;
      font-weight: 600;
      color: #000000;
      margin-bottom: 30px;
    }

    .search-block {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      max-width: 80%;
      margin: 0 auto;
    }
    .search-bar-container {
      display: flex;
      align-items: center;
      background-color: #fff;
      border: 1px solid #E7E7EE;
      border-radius: 50px;
      padding: 10px 20px;
      height: 65px;
      width: 100%;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .search-main-input {
      border: none;
      outline: none;
      flex: 1;
      font-size: 1.1rem;
      font-weight: 600;
      color: #000;
      background: transparent;
    }
    .search-main-input::placeholder {
      color: #555;
    }
    .search-elements-inside {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .search-select-inner,
    .search-input-inner {
      height: 42px;
      border-radius: 50px;
      border: 1px solid #aaa;
      padding: 0 18px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      background-color: #fff;
      cursor: pointer;
    }
    .search-input-inner {
      width: 100px;
    }

    .search-icon-button {
      background: none;
      border: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
    }
    .search-icon-inner {
      font-size: 1.3rem;
      color: #8A8A8A;
      cursor: pointer;
    }

    .btn-advanced-search {
      background-color: #FFFFFF;
      border-radius: 35px;
      padding: 0 32px;
      text-align: center;
      font-weight: 700;
      color: #000000;
      text-decoration: none;
      line-height: 1.3;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
      height: 85px;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      transition: box-shadow 0.2s ease, transform 0.2s ease;
      border: none;
    }
    .btn-advanced-search:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .universities-section {
      background-color: #f8f7fB;
      padding: 0 20px 60px 20px;
      text-align: center;
    }
    .content-card {
      background-color: #FFFFFF;
      border-radius: 25px;
      padding: 30px 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      max-width: 1200px;
      margin: 0 auto;
    }
    .universities-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #0D8EFF;
      margin-bottom: 30px;
    }
    .pills-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 15px;
    }
    .pill {
      display: inline-block;
      padding: 10px 20px;
      border-radius: 50px;
      background-color: #0D8EFF;
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
    }
    .pill:hover {
      background-color: #0056b3;
    }
    .cta-section {
      background-color: #FFFFFF;
      color: #240334;
    }
    .btn-forum {
      padding: 12px 28px;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 1.25rem;
      cursor: pointer;
      background-color: #0D8EFF;
      color: #FFFFFF;
      text-decoration: none;
      display: inline-block;
      margin-bottom: 20px;
    }
    .cta-section h3 {
      font-size: 1.75rem;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .cta-section p {
      font-size: 1.1rem;
      color: #555;
      margin-bottom: 25px;
    }
    .btn-primary-blue {
      padding: 14px 30px;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      background-color: #0D8EFF;
      color: #FFFFFF;
      text-decoration: none;
      display: inline-block;
    }
    .btn-primary-blue:hover {
      background-color: #0056b3;
    }
    .team-section {
      background-color: #f8f7fB;
    }
    .team-section h2 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .team-section > .container > p {
      font-size: 1.1rem;
      color: #555;
      margin-bottom: 40px;
    }
    .team-grid {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 30px;
    }
    .team-member {
      flex-basis: 250px;
    }
    .team-member img {
      width: 180px;
      height: 180px;
      border-radius: 50%;
      object-fit: cover;
      margin-bottom: 20px;
    }
    .team-member strong {
      font-size: 1.2rem;
      font-weight: 700;
      line-height: 1.4;
    }
    .faq-section {
      background-color: #f8f7fB; /* Fondo gris claro */
      padding: 60px 20px;
    }
    .faq-container {
      max-width: 900px;
      margin: 0 auto;
      text-align: left;
    }
    .faq-section h2 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 40px;
      text-align: left;
    }
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
    .faq-item strong {
      display: block;
      font-size: 1.1rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: #000;
    }
    .faq-item p {
      font-size: 0.95rem;
      color: #555;
      line-height: 1.6;
      margin: 0;
    }
    .faq-contact {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #E7E7EE;
      text-align: center;
    }
    .faq-contact h3 {
      font-size: 1.5rem;
      font-weight: 700;
    }
    @media (max-width: 850px) {
      .container { padding: 40px 20px; }
      .hero-section h1 { font-size: 2rem; }
      .search-block {
        display: flex;
        flex-direction: column;
        gap: 15px;
        max-width: 100%;
      }
      .search-bar-container { width: 100%; }
      .search-main-input { height: 60px; padding-right: 60px; }
      .search-elements-inside { right: 20px; }
      .search-select-inner, .search-input-inner { display: none; }
      .search-icon-inner { margin-left: 0; font-size: 1.2rem; }
      .search-icon-button { }
      .btn-advanced-search { height: 60px; width: 100%; }
      .team-grid { flex-direction: column; align-items: center; }
    }
  `]
})
export class HomeComponent implements OnInit { // <-- CAMBIO 3: Implementamos OnInit
  iconCurso = faGraduationCap;
  iconSearch = faSearch;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private courseService = inject(CourseService);

  searchForm: FormGroup;
  isAdvancedSearchOpen = signal(false);
  private advancedFilters = signal<Partial<SearchResourceParams>>({});

  universities = signal<UniversityRanking[]>([]);
  universityLoadingMessage = signal('Cargando universidades...');

  constructor() {
    this.searchForm = this.fb.group({
      keyword: [''],
      tipo: [''],
      cursoId: ['']
    });
  }
  ngOnInit(): void {
    this.loadUniversityRanking();
  }

  loadUniversityRanking(): void {
    this.courseService.getRankingUniversidades().pipe(
      tap((data) => {
        this.universities.set(data);
        if (data.length === 0) {
          this.universityLoadingMessage.set('No hay universidades para mostrar.');
        }
      }),
      catchError((err) => {
        console.error('Error al cargar ranking de universidades:', err);
        this.universityLoadingMessage.set('No se pudo cargar el ranking.');
        return of([]);
      })
    ).subscribe();
  }

  onOpenAdvancedSearch(): void {
    this.isAdvancedSearchOpen.set(true);
  }
  onCloseAdvancedSearch(): void {
    this.isAdvancedSearchOpen.set(false);
  }
  onApplyFilters(filters: any): void {
    this.advancedFilters.set(filters);
    this.onCloseAdvancedSearch();
    this.navigateToSearch();
  }
  onSimpleSearch(): void {
    this.navigateToSearch();
  }
  private navigateToSearch(): void {
    const simpleParams = this.searchForm.value;
    const advancedParams = this.advancedFilters();
    const allParams: SearchResourceParams = { ...simpleParams, ...advancedParams };
    const queryParams: any = {};
    for (const key in allParams) {
      const value = (allParams as any)[key];
      if (value) {
        queryParams[key] = value;
      }
    }
    console.log('Navegando a /search con los filtros:', queryParams);
    this.router.navigate(['/search'], { queryParams: queryParams });
  }
}
