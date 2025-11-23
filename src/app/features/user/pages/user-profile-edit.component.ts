import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UserProfile } from '../../../core/models/user-profile.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-profile-edit-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="profile-wrapper">
      <section class="profile-card">
        <header class="profile-header">
          <div class="profile-title-block">
            <h1 class="card-title">Editar perfil</h1>
            <p class="card-subtitle">
              Actualiza tu información para mejorar tus recomendaciones y
              recursos sugeridos.
            </p>
          </div>
        </header>

        <form class="profile-form" [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-grid">
            <!-- Nombres -->
            <div class="form-field">
              <label for="nombre">Nombres</label>
              <input
                id="nombre"
                type="text"
                formControlName="nombre"
                placeholder="Tus nombres"
              />
            </div>

            <!-- Apellidos -->
            <div class="form-field">
              <label for="apellidos">Apellidos</label>
              <input
                id="apellidos"
                type="text"
                formControlName="apellidos"
                placeholder="Tus apellidos"
              />
            </div>

            <!-- Universidad -->
            <div class="form-field full-width">
              <label for="universidad">Universidad</label>
              <select id="universidad" formControlName="universidad">
                <option value="">Selecciona tu universidad</option>
                <option *ngFor="let uni of universidades" [value]="uni">
                  {{ uni }}
                </option>
              </select>
            </div>

            <!-- Carrera -->
            <div class="form-field full-width">
              <label for="carrera">Carrera</label>
              <select id="carrera" formControlName="carrera">
                <option value="">Selecciona tu carrera</option>
                <option *ngFor="let carrera of carrerasDisponibles" [value]="carrera">
                  {{ carrera }}
                </option>
              </select>
            </div>

            <!-- Ciclo -->
            <div class="form-field cycle-field">
              <label for="ciclo">Ciclo</label>
              <select id="ciclo" formControlName="ciclo">
                <option value="">Selecciona tu ciclo</option>
                <option *ngFor="let c of ciclos" [value]="c">
                  {{ c }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-footer">
            <div class="left">
              <button
                type="submit"
                class="btn-primary"
                [disabled]="form.invalid || saving"
              >
                {{ saving ? 'Guardando...' : 'Guardar cambios' }}
              </button>
              <button
                type="button"
                class="btn-secondary"
                [routerLink]="['/profile']"
                [disabled]="saving"
              >
                Cancelar
              </button>
            </div>

            <button
              type="button"
              class="btn-danger"
              (click)="onDeleteAccount()"
              [disabled]="saving"
            >
              Eliminar cuenta
            </button>
          </div>
        </form>
      </section>
    </div>
  `,
  styles: [`
    .profile-wrapper {
      max-width: 960px;
      margin: 0 auto;
      font-family: 'Poppins', sans-serif;
    }

    .profile-card {
      background-color: #ffffff;
      border-radius: 24px;
      padding: 24px 28px 26px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
    }

    .profile-header {
      border-bottom: 1px solid #e5e5f0;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }

    .card-title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #000000;
    }

    .card-subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: #555555;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-size: 13px;
      font-weight: 600;
      color: #333333;
    }

    .form-field input,
    .form-field select {
      border-radius: 999px;
      border: 1px solid #d0d0e0;
      padding: 9px 14px;
      font-size: 13px;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .form-field input:focus,
    .form-field select:focus {
      border-color: #0d8eff;
      box-shadow: 0 0 0 2px rgba(13, 142, 255, 0.18);
    }

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #e5e5f0;
      padding-top: 14px;
      margin-top: 4px;
      gap: 12px;
    }

    .form-footer .left {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-primary {
      padding: 9px 22px;
      border-radius: 999px;
      border: none;
      background-color: #007bff;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-primary:not(:disabled):hover {
      background-color: #0065cf;
    }

    .btn-secondary {
      padding: 8px 18px;
      border-radius: 999px;
      border: 1px solid #d0d0e0;
      background-color: #ffffff;
      color: #333333;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #f5f5ff;
    }

    .btn-danger {
      padding: 8px 18px;
      border-radius: 999px;
      border: none;
      background-color: #ff4b4b;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-danger:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #e04040;
    }

    @media (max-width: 900px) {
      .profile-card {
        padding: 20px 18px 22px;
        border-radius: 18px;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-field.full-width {
        grid-column: auto;
      }

      .form-footer {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-footer .left {
        width: 100%;
        justify-content: flex-start;
      }
    }
  `]
})
export class UserProfileEditPageComponent implements OnInit {
  form: FormGroup;
  saving = false;
  currentUserId!: number;

  universidades: string[] = [
    'Universidad Nacional de Ingeniería (UNI)',
    'Universidad Nacional Mayor de San Marcos (UNMSM)',
    'Universidad Nacional Federico Villarreal (UNFV)',
    'Pontificia Universidad Católica del Perú (PUCP)',
    'Universidad de Lima (ULima)',
    'Universidad Peruana de Ciencias Aplicadas (UPC)',
    'Universidad de Ingeniería y Tecnología (UTEC)',
    'Universidad Tecnológica del Perú (UTP)'
  ];

  carrerasPorUniversidad: Record<string, string[]> = {
    'Universidad Nacional de Ingeniería (UNI)': [
      'Ingeniería de Sistemas',
      'Ingeniería de Computación y Sistemas',
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Ingeniería Electrónica',
      'Ingeniería Ambiental',
      'Ingeniería de Minas',
      'Ingeniería Metalúrgica',
      'Ciencias de la Computación'
    ],
    'Universidad Nacional Mayor de San Marcos (UNMSM)': [
      'Ingeniería de Sistemas',
      'Ingeniería de Software',
      'Ingeniería Electrónica',
      'Ingeniería Industrial',
      'Ingeniería Ambiental',
      'Ingeniería de Telecomunicaciones',
      'Ingeniería de Energía',
      'Ciencias de la Computación'
    ],
    'Universidad Nacional Federico Villarreal (UNFV)': [
      'Ingeniería de Sistemas',
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería de Transportes',
      'Ingeniería Sanitaria'
    ],
    'Pontificia Universidad Católica del Perú (PUCP)': [
      'Ciencias de la Computación',
      'Ingeniería de las Telecomunicaciones',
      'Ingeniería Mecatrónica',
      'Ingeniería Civil',
      'Ingeniería Industrial',
      'Ingeniería Electrónica',
      'Ingeniería de Energía',
      'Ciencias de la Computación'
    ],
    'Universidad de Lima (ULima)': [
      'Ingeniería de Sistemas',
      'Ingeniería Industrial',
      'Ingeniería Civil',
      'Ingeniería de Gestión Empresarial'
    ],
    'Universidad Peruana de Ciencias Aplicadas (UPC)': [
      'Ingeniería de Software',
      'Ingeniería de Sistemas de Información',
      'Ingeniería de Tecnologías de Información y Sistemas',
      'Ingeniería Industrial',
      'Ingeniería Civil',
      'Ingeniería de Gestión Empresarial',
      'Ingeniería Ambiental',
      'Ciencias de la Computación'
    ],
    'Universidad de Ingeniería y Tecnología (UTEC)': [
      'Ingeniería de la Energía',
      'Ingeniería Ambiental',
      'Ingeniería Mecatrónica',
      'Ingeniería Civil',
      'Ingeniería Química',
      'Ingeniería de Computación'
    ],
    'Universidad Tecnológica del Perú (UTP)': [
      'Ingeniería de Sistemas',
      'Ingeniería de Software',
      'Ingeniería Industrial',
      'Ingeniería Mecánica',
      'Ingeniería Mecatrónica',
      'Ingeniería de Seguridad Industrial y Minera',
      'Ingeniería de Gestión Minera'
    ]
  };

  // Carreras visibles según la universidad elegida
  carrerasDisponibles: string[] = [];

  ciclos: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      universidad: [''],
      carrera: [''],
      ciclo: ['']
    });
    // Lógica dependencia Universidad → Carrera
    const uniControl = this.form.get('universidad');
    const carreraControl = this.form.get('carrera');

    // Al inicio, deshabilitamos carrera
    carreraControl?.disable({ emitEvent: false });

    uniControl?.valueChanges.subscribe((uni) => {
      this.syncCarrerasForUniversidad(uni, /* resetCarrera */ true);
    });
  }

    private syncCarrerasForUniversidad(
    uni: string | null | undefined,
    resetCarrera: boolean
  ): void {
    const carreraControl = this.form.get('carrera');

    if (!uni) {
      this.carrerasDisponibles = [];
      if (resetCarrera) {
        carreraControl?.reset('');
      }
      carreraControl?.disable({ emitEvent: false });
      return;
    }

    const lista = this.carrerasPorUniversidad[uni] ?? [];
    this.carrerasDisponibles = lista;

    if (lista.length > 0) {
      carreraControl?.enable({ emitEvent: false });
      if (resetCarrera) {
        carreraControl?.reset('');
      }
    } else {
      if (resetCarrera) {
        carreraControl?.reset('');
      }
      carreraControl?.disable({ emitEvent: false });
    }
  }


  ngOnInit(): void {
    this.usuarioService.getCurrentProfile().subscribe({
      next: (profile: UserProfile) => {
        this.currentUserId = profile.id_usuario;

        const universidad = profile.profile?.universidad ?? '';
        const carrera = profile.profile?.carrera ?? '';
        const ciclo = profile.profile?.ciclo ?? '';

        // Primero seteamos universidad y ciclo
        this.form.patchValue({
          nombre: profile.profile?.nombre ?? '',
          apellidos: profile.profile?.apellidos ?? '',
          universidad,
          ciclo
        });

        // Sincroniza lista de carreras para esa universidad, sin resetear
        this.syncCarrerasForUniversidad(universidad, /* resetCarrera */ false);

        // Ahora seteamos carrera
        this.form.patchValue({
          carrera
        });
      },
      error: (error: unknown) => {
        console.error('❌ Error al cargar perfil para editar:', error);
      }
    });
  }


  onSubmit(): void {
    if (this.form.invalid || !this.currentUserId) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const raw = this.form.value;
    const cicloValue =
      raw.ciclo === '' || raw.ciclo == null ? null : Number(raw.ciclo);

    this.usuarioService
      .updateProfile(this.currentUserId, {
        nombre: raw.nombre ?? '',
        apellidos: raw.apellidos ?? '',
        universidad: raw.universidad || null,
        carrera: raw.carrera || null,
        ciclo: cicloValue
      })
      .subscribe({
         next: () => {
           this.saving = false;
            
           const fullName = `${raw.nombre ?? ''}`.trim();
           this.authService.setUserName(fullName);
           this.authService.setUserUniversity(raw.universidad || null);
            
           this.router.navigate(['/profile']);
         },
         error: (error: unknown) => {
           console.error('❌ Error al guardar perfil:', error);
           this.saving = false;
         }
      });
  }

  onDeleteAccount(): void {
    const confirmed = confirm(
      '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (!confirmed) {
      return;
    }

    this.saving = true;

    this.usuarioService.deleteCurrentUser().subscribe({
      next: () => {
        this.saving = false;
        // usa el mismo método que uses en el navbar para cerrar sesión
        this.authService.logout(); // si el nombre es distinto, ajusta
        this.router.navigate(['/auth/login']);
      },
      error: (error: unknown) => {
        console.error('❌ Error al eliminar cuenta:', error);
        this.saving = false;
      }
    });
  }
}
