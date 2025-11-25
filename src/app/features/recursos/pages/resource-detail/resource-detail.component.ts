import { Component, computed, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceService } from '../../../../core/services/resource.service';
import { BibliotecaService } from '../../../../core/services/biblioteca.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Resource } from '../../../../core/models/resource.model';
import { BibliotecaResponse } from '../../../../core/models/biblioteca.model';
import { DatePipe } from '@angular/common';
import { CourseService } from '../../../../core/services/course.service';
import { Course } from '../../../../core/models/course.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ResenaService } from '../../../../core/services/resena.service';
import { ResenaCreateRequest, ResenaResponse } from '../../../../core/models/resena.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { renderAsync } from 'docx-preview';

type VisorFormato = 'PDF' | 'DOCX' | 'DOC';

@Component({
  selector: 'app-resource-detail',
  imports: [
    DatePipe,
    ReactiveFormsModule
  ],
  templateUrl: './resource-detail.component.html',
  styleUrl: './resource-detail.component.css',
})
export class ResourceDetailComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private resourceService = inject(ResourceService);
  private courseService = inject(CourseService);
  private bibliotecaService = inject(BibliotecaService);
  private authService = inject(AuthService);
  private resenaService = inject(ResenaService);
  private fb = inject(FormBuilder);

  private sanitizer = inject(DomSanitizer);

  recurso = signal<Resource | null>(null);
  curso = signal<Course | null>(null);

  loading = signal(true);
  error = signal<string | null>(null);

  loadingArchivo = signal(false);
  errorVisor = signal<string | null>(null);

  guardando = signal(false);
  guardado = signal(false);

  isAuthenticated = computed(() => this.authService.isAuthenticated());

  resenas = signal<ResenaResponse[]>([]);
  loadingResenas = signal(false);
  resenasError = signal<string | null>(null);

  enviandoResena = signal(false);
  errorResena = signal<string | null>(null);
  editandoVoto = signal<Record<number, boolean>>({})

  mostrarVisor = signal(false);
  tipoArchivo = signal<VisorFormato | null>(null);
  pdfUrlSegura = signal<SafeResourceUrl | null>(null);

  nombreArchivoDisplay = computed(() => {
    const r = this.recurso();
    if (!r || !r.contenido) return '';
    return this.cleanFilename(r.contenido);
  });

  usuarioYaReseno = computed(() => {
    const user = this.authService.getUserName();
    if (!user) return false;
    return this.resenas().some(r => r.nombre_autor === user);
  });

  private blobUrl: string | null = null;

  @ViewChild('docxContainer') docxContainer!: ElementRef<HTMLDivElement>;

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

  ngOnDestroy(): void {
    if (this.blobUrl) {
      window.URL.revokeObjectURL(this.blobUrl);
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
      error: (err: HttpErrorResponse) => {
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

  cerrarVisor(): void {
    this.mostrarVisor.set(false);
    this.tipoArchivo.set(null);
    this.errorVisor.set(null);
    if (this.blobUrl) {
      window.URL.revokeObjectURL(this.blobUrl);
      this.blobUrl = null;
      this.pdfUrlSegura.set(null);
    }
  }

  toggleVisor(): void {
    if (this.mostrarVisor()) {
      this.cerrarVisor();
      return;
    }

    const recurso = this.recurso();
    if (!recurso) return;

    const nombreArchivo = recurso.contenido.toLowerCase();
    let formatoDetectado: VisorFormato | 'OTRO' = 'OTRO';

    if (nombreArchivo.endsWith('.pdf')) formatoDetectado = 'PDF';
    else if (nombreArchivo.endsWith('.docx')) formatoDetectado = 'DOCX';
    else if (nombreArchivo.endsWith('.doc')) formatoDetectado = 'DOC';

    if (formatoDetectado === 'OTRO') {
      alert('La vista previa solo está disponible para PDF y archivos Word (.docx).');
      return;
    }

    this.tipoArchivo.set(formatoDetectado);
    this.errorVisor.set(null);

    this.loadingArchivo.set(true);
    this.mostrarVisor.set(true);

    this.resourceService.getResourceFile(recurso.id_recurso).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blobOriginal = response.body;
        if (!blobOriginal) {
          this.errorVisor.set('El archivo está vacío.');
          this.loadingArchivo.set(false);
          return;
        }

        if (formatoDetectado === 'PDF') {
          const pdfBlob = new Blob([blobOriginal], { type: 'application/pdf' });
          this.blobUrl = window.URL.createObjectURL(pdfBlob);
          this.pdfUrlSegura.set(this.sanitizer.bypassSecurityTrustResourceUrl(this.blobUrl));
          this.loadingArchivo.set(false);
        }
        else if (formatoDetectado === 'DOCX' || formatoDetectado === 'DOC') {
          const docxBlob = new Blob([blobOriginal], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          });

          // Esperamos un ciclo para que el @if renderice el div
          setTimeout(() => {
            // Verificamos si existe el ViewChild
            if (this.docxContainer && this.docxContainer.nativeElement) {
              const renderOptions = {
                className: 'docx-wrapper', // Clase CSS para el documento renderizado
                inWrapper: true, // Envuelve el contenido en un div
                ignoreWidth: true, // Ignora el ancho de la página, se ajusta al contenedor
                ignoreHeight: true, // Respeta la altura de la página
                renderHeaders: false, // Renderiza encabezados
                renderFooters: false, // Renderiza pies de página
                renderFootnotes: false, // Renderiza notas al pie
                renderEndnotes: false, // Renderiza notas finales
                useBase64URL: false, // Usa URLs blob en lugar de base64
                renderChanges: false, // No renderiza marcas de cambios/revisiones
                debug: true // Modo debug (puedes activarlo para ver info en consola)
              };

              renderAsync(docxBlob, this.docxContainer.nativeElement, undefined, renderOptions)
                .then(() => {
                  console.log('DOCX renderizado correctamente');
                  this.loadingArchivo.set(false);
                })
                .catch(err => {
                  console.error('Error renderizando DOCX', err);
                  this.errorVisor.set('No se pudo visualizar el documento. Intenta descargarlo.');
                  this.loadingArchivo.set(false);
                });
            } else {
              // CRÍTICO: Si no encuentra el contenedor, detener la carga
              console.error('No se encontró el contenedor #docxContainer');
              this.errorVisor.set('Error interno de visualización.');
              this.loadingArchivo.set(false);
            }
          }, 100);
        }
      },
      error: (err) => {
        console.error('Error descargando blob', err);
        this.errorVisor.set('Error de conexión al descargar el archivo.');
        this.loadingArchivo.set(false);
      }
    });
  }


  descargarArchivo(): void {
    const recurso = this.recurso();
    if (!recurso) return;

    this.loadingArchivo.set(true);

    this.resourceService.getResourceFile(recurso.id_recurso).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        if (!blob) {
          alert('El archivo descargado está vacío.');
          this.loadingArchivo.set(false);
          return;
        }

        // Intentar obtener el nombre del archivo desde el header Content-Disposition
        const contentDisposition = response.headers.get('content-disposition');
        let filename = recurso.contenido || `recurso-${recurso.id_recurso}`;

        if (contentDisposition) {
          const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }

        // Limpiar prefijo de ID si existe (ej: "123_nombre.pdf" o "uuid_nombre.pdf")
        // Aplicamos esto tanto si viene del header como si viene de recurso.contenido
        filename = this.cleanFilename(filename);

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
        this.loadingArchivo.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error descargando:', err);
        alert('No se pudo descargar el archivo.');
        this.loadingArchivo.set(false);
      }
    });
  }

  private cleanFilename(filename: string): string {
    // Buscamos un patrón de ID seguido de guion bajo al inicio
    const prefixMatch = /^[a-zA-Z0-9-]{1,50}_/.exec(filename);
    if (prefixMatch) {
      return filename.substring(prefixMatch[0].length);
    }
    return filename;
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
