import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ResourceService} from '../../../../core/services/resource.service';
import {BibliotecaService} from '../../../../core/services/biblioteca.service';
import {AuthService} from '../../../../core/services/auth.service';
import {Resource} from '../../../../core/models/resource.model';
import {BibliotecaResponse} from '../../../../core/models/biblioteca.model';
import {DatePipe} from '@angular/common';
import {CourseService} from '../../../../core/services/course.service';
import {Course} from '../../../../core/models/course.model';
import {HttpErrorResponse} from '@angular/common/http';
import {ResenaService} from '../../../../core/services/resena.service';
import {ResenaCreateRequest, ResenaResponse} from '../../../../core/models/resena.model';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-resource-detail',
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './resource-detail.component.html',
  styleUrl: './resource-detail.component.css',
})
export class ResourceDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private resourceService = inject(ResourceService);
  private courseService = inject(CourseService);
  private bibliotecaService = inject(BibliotecaService);
  private authService = inject(AuthService);
  private resenaService = inject(ResenaService);
  private fb = inject(FormBuilder);

  recurso = signal<Resource | null>(null);
  curso = signal<Course | null>(null);

  loading = signal(true);
  error = signal<string | null>(null);

  guardando = signal(false);
  guardado = signal(false);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  resenas = signal<ResenaResponse[]>([]);
  loadingResenas = signal(false);
  resenasError = signal<string | null>(null);

  enviandoResena = signal(false);
  errorResena = signal<string | null>(null);
  editandoVoto = signal<Record<number, boolean>>({})

  private idBiblioteca: number | null = null;

  resenaForm: FormGroup = this.fb.group({
    contenido: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
    es_positivo: [null, [Validators.required]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const idRecurso = idParam ? Number(idParam) : NaN;

    if (!idRecurso) {
      this.error.set('Recurso no encontrado.');
      this.loading.set(false);
      return;
    }

    this.cargarRecursoYCurso(idRecurso);
    this.cargarResenas(idRecurso);

    if (this.isAuthenticated()) {
      this.cargarBibliotecaUsuario();
    }
  }

  private cargarRecursoYCurso(idRecurso: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.resourceService.getResourceById(idRecurso).subscribe({
      next: (res: Resource) => {
        this.recurso.set(res);

        if (this.idBiblioteca) {
          this.verificarSiEstaGuardado(this.idBiblioteca, res.id_recurso);
        }

        // Llamada extra para completar info del curso
        this.courseService.getCursoById(res.id_curso).subscribe({
          next: (curso) => {
            this.curso.set(curso);
            this.recurso.update(r =>
              r
                ? {
                  ...r,
                  nombreCurso: curso.nombre,
                  nombreUniversidad: curso.universidad
                }
                : r
            );
            this.loading.set(false);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error al cargar curso:', err);
            // Aunque falle el curso, mostramos el recurso igual
            this.loading.set(false);
          }
        });
      },
      error: (err:HttpErrorResponse) => {
        console.error(err);
        this.error.set('No se pudo cargar el recurso.');
        this.loading.set(false);
      }
    });
  }

  private cargarBibliotecaUsuario(): void {
    this.bibliotecaService.obtenerBibliotecaUsuario().subscribe({
      next: (biblioteca: BibliotecaResponse) => {
        this.idBiblioteca = biblioteca.id_biblioteca;

        const recurso = this.recurso();
        if (recurso) {
          this.verificarSiEstaGuardado(biblioteca.id_biblioteca, recurso.id_recurso);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.idBiblioteca = null;
      }
    });
  }

  private verificarSiEstaGuardado(idBiblioteca: number, idRecurso: number): void {
    this.bibliotecaService.verificarRecursoGuardado(idBiblioteca, idRecurso).subscribe({
      next: (estaGuardado: boolean) => {
        this.guardado.set(estaGuardado);
      },
      error: (err: HttpErrorResponse) => console.error('Error verificando si está guardado', err)
    });
  }

  private cargarResenas(idRecurso: number): void {
    this.loadingResenas.set(true);
    this.resenasError.set(null);
    this.resenas.set([]);

    this.resenaService.getResenasPorRecurso(idRecurso).subscribe({
      next: (lista) => {
        this.resenas.set(lista);
        this.loadingResenas.set(false);
      },
      error: (err) => {
        console.error('Error al cargar reseñas:', err);
        this.resenasError.set('No se pudieron cargar las reseñas.');
        this.loadingResenas.set(false);
      }
    });
  }

  guardarEnBiblioteca(): void {
    const recurso = this.recurso();
    if (!recurso || !this.idBiblioteca || this.guardando() || this.guardado()) {
      return;
    }

    this.guardando.set(true);
    this.error.set(null);

    this.bibliotecaService
      .guardarRecursoEnBiblioteca(this.idBiblioteca, recurso.id_recurso)
      .subscribe({
        next: () => {
          this.guardando.set(false);
          this.guardado.set(true);
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          this.guardando.set(false);
          this.error.set('No se pudo guardar el recurso en tu biblioteca.');
        }
      });
  }

  enviarResena(): void {
    const recurso = this.recurso();
    if (!recurso || !this.isAuthenticated() || this.enviandoResena()) {
      return;
    }

    if (this.resenaForm.invalid) {
      this.resenaForm.markAllAsTouched();
      this.errorResena.set('Revisa el contenido y si fue útil o no.');
      return;
    }

    const { contenido, es_positivo } = this.resenaForm.value;

    const payload: ResenaCreateRequest = {
      id_recurso: recurso.id_recurso,
      contenido,
      es_positivo
    };

    this.enviandoResena.set(true);
    this.errorResena.set(null);

    this.resenaService.createResena(payload).subscribe({
      next: (resenaCreada) => {
        this.enviandoResena.set(false);
        this.resenas.update(lista => [resenaCreada, ...lista]);
        this.resenaForm.reset({
          contenido: '',
          es_positivo: null
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al crear reseña:', err);
        this.enviandoResena.set(false);
        this.errorResena.set('No se pudo publicar la reseña. Inténtalo nuevamente.');
      }
    });
  }

  esTexto(): boolean {
    return this.recurso()?.formato === 'TEXTO';
  }

  esEnlace(): boolean {
    return this.recurso()?.formato === 'ENLACE';
  }

  esArchivo(): boolean {
    return this.recurso()?.formato === 'ARCHIVO';
  }

  descargarArchivo(): void {
    const recurso = this.recurso();
    if (!recurso) return;

    this.loading.set(true);

    this.resourceService.getResourceFile(recurso.id_recurso).subscribe({
      next: (blob: Blob) => {
        // Crear una URL temporal para el blob
        const url = window.URL.createObjectURL(blob);

        // Crear un elemento <a> invisible
        const link = document.createElement('a');
        link.href = url;

        // Usar el contenido como nombre de archivo o un default
        link.download = recurso.contenido || `recurso-${recurso.id_recurso}`;

        // Simular clic
        link.click();

        // Limpiar
        window.URL.revokeObjectURL(url);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error descargando archivo:', err);
        alert('No se pudo descargar el archivo. Inténtalo más tarde.');
        this.loading.set(false);
      }
    });
  }

  get contenidoCtrl() {
    return this.resenaForm.get('contenido');
  }

  get esPositivoCtrl() {
    return this.resenaForm.get('es_positivo');
  }

  estaEditandoVoto(idResena: number): boolean {
    return this.editandoVoto()[idResena];
  }

  // Validación básica, solo por nombre del usuario
  puedeEditarResena(resena: ResenaResponse): boolean {
    const currentUserName = this.authService.getUserName?.();
    return this.isAuthenticated() && !!currentUserName && currentUserName === resena.nombre_autor;
  }

  toggleVotoResena(resena: ResenaResponse): void {
    if (!this.puedeEditarResena(resena)) {
      return;
    }

    const nuevoVoto = !resena.es_positivo;

    this.editandoVoto.update(state => ({ ...state, [resena.id_resena]: true }));

    this.resenaService
      .updateResenaPartial(resena.id_resena, { es_positivo: nuevoVoto })
      .subscribe({
        next: (resenaActualizada) => {
          this.resenas.update(lista =>
            lista.map(r => (r.id_resena === resenaActualizada.id_resena ? resenaActualizada : r))
          );
          this.editandoVoto.update(state => ({ ...state, [resena.id_resena]: false }));
        },
        error: (err: HttpErrorResponse) => {
          console.error('Error al actualizar voto de la reseña:', err);
          this.editandoVoto.update(state => ({ ...state, [resena.id_resena]: false }));
          this.errorResena.set('No se pudo actualizar tu voto. Inténtalo de nuevo.');
        }
      });
  }
}
