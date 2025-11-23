import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import {BibliotecaService} from '../../../core/services/biblioteca.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <!-- Fila 1: Nombres / Apellidos -->
        <div class="row two-cols">
          <div class="field">
            <label for="nombres">Nombres</label>
            <input
              id="nombres"
              type="text"
              formControlName="nombres"
              placeholder="Tus nombres"
            />
          </div>

          <div class="field">
            <label for="apellidos">Apellidos</label>
            <input
              id="apellidos"
              type="text"
              formControlName="apellidos"
              placeholder="Tus apellidos"
            />
          </div>
        </div>

        <!-- Fila 2: Institución / Carrera / Ciclo -->
        <div class="row three-cols">
          <div class="field">
            <label for="universidad">Institución educativa</label>
            <select id="universidad" formControlName="universidad">
              <option value="" disabled>Universidad</option>
              <option *ngFor="let uni of universidades" [value]="uni">
                {{ uni }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="carrera">Carrera</label>
            <select id="carrera" formControlName="carrera">
              <option value="" disabled> Carrera </option>
              <option *ngFor="let car of carrerasDisponibles" [value]="car">
                {{ car }}
              </option>
            </select>
          </div>

          <div class="field">
            <label for="ciclo">Ciclo</label>
            <select id="ciclo" formControlName="ciclo">
              <option value="" disabled>Ciclo</option>
              <option *ngFor="let c of ciclos" [value]="c">
                {{ c }}
              </option>
            </select>
          </div>
        </div>


        <!-- Correo -->
        <div class="row one-col">
          <div class="field">
            <label for="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              formControlName="email"
              placeholder="tucorreoelectronico@cualquiermail.com"
            />
          </div>
        </div>

        <!-- Contraseñas -->
        <div class="row two-cols">
          <div class="field">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="contraseña"
            />
          </div>

          <div class="field">
            <label for="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type="password"
              formControlName="confirmPassword"
              placeholder="contraseña"
            />
          </div>
        </div>

        <!-- Mensajes de error generales -->
        <p class="error" *ngIf="form.invalid && form.touched">
          Revisa que todos los campos estén completos y correctos.
        </p>
        <p class="error" *ngIf="passwordMismatch() && form.touched">
          Las contraseñas no coinciden.
        </p>
        <p class="error" *ngIf="serverError()">
          {{ serverError() }}
        </p>

        <!-- Footer: link + botón -->
        <div class="row footer-row">
          <span class="have-account">
            Ya tengo una cuenta
            <a [routerLink]="['/auth/login']">Iniciar sesión</a>
          </span>

          <button
            type="submit"
            class="btn-submit"
            [disabled]="form.invalid || loading()"
          >
            {{ loading() ? 'Creando cuenta...' : '¡Crear la cuenta!' }}
          </button>
        </div>
      </form>
    </div>
  `,
    styles: [`
    .register-container {
      width: 100%;
      padding: 32px 56px 40px;
      box-sizing: border-box;
      font-family: 'Poppins', system-ui, -apple-system, BlinkMacSystemFont,
        'Segoe UI', sans-serif;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* Fila genérica: los campos se acomodan y hacen wrap si falta espacio */
    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      width: 100%;
    }

    /* Fila de 2 columnas (Nombres/Apellidos, Contraseña/Confirmar) */
    .two-cols .field {
      flex: 1 1 300px;   /* mínimo 300px por campo, luego se adaptan */
    }

    /* Fila de 3 columnas (Universidad/Carrera/Ciclo) */
    .three-cols .field {
      flex: 1 1 240px;   /* mínimo 240px por campo */
    }

    /* Fila de 1 columna (Correo) */
    .one-col .field {
      flex: 1 1 100%;
    }

    .footer-row {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      margin-top: 8px;
    }

    .field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-size: 14px;
      font-weight: 600;
      color: #000000;
    }

    input,
    select {
      width: 100%;
      padding: 12px 18px;
      border-radius: 999px;
      border: 1px solid #000;
      font-size: 14px;
      font-weight: 500;
      outline: none;
      box-sizing: border-box;
    }

    input::placeholder {
      color: #9b9b9b;
    }

    select {
      background-color: #ffffff;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
    }

    .have-account {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
    }

    .have-account a {
      margin-left: 4px;
      font-weight: 600;
      text-decoration: underline;
      cursor: pointer;
      color: #000000;
    }

    .btn-submit {
      padding: 12px 32px;
      border-radius: 999px;
      border: none;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      background-color: #00c43b; /* verde bright */
      color: #ffffff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
      min-width: 180px;
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error {
      color: #c0392b;
      font-size: 12px;
      margin: 0;
    }

    @media (max-width: 900px) {
      .register-container {
        padding: 24px 20px 32px;
      }

      .footer-row {
        flex-direction: column;
        align-items: flex-start;
      }

      .btn-submit {
        align-self: stretch;
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class RegisterComponent {
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
      'Ingeniería Mecánica',
      'Ingeniería Eléctrica',
      'Ingeniería Electrónica',
      'Ingeniería de Minas',
      'Ingeniería Metalúrgica',
      'Ingeniería Ambiental',
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
      'Ingeniería de Computación',
      'Ciencias de la Computación'
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

  carrerasDisponibles: string[] = [];

  ciclos: number[] = Array.from({ length: 10 }, (_, i) => i + 1);

  form: FormGroup;
  loading = signal(false);
  serverError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private bibliotecaService: BibliotecaService
  ) {
    this.form = this.fb.group({
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      universidad: ['', [Validators.required]],
      carrera: ['', [Validators.required]],
      ciclo: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordsMatchValidator
    });
    // Lógica de dependencia Universidad > Carrera
    const uniControl = this.form.get('universidad');
    const carreraControl = this.form.get('carrera');

    // Al inicio, deshabilitamos carrera
    carreraControl?.disable({ emitEvent: false });

    uniControl?.valueChanges.subscribe((uni) => {
      if (!uni) {
        // Si no hay universidad seleccionada, limpiamos y deshabilitamos carrera
        this.carrerasDisponibles = [];
        carreraControl?.reset('');
        carreraControl?.disable({ emitEvent: false });
      } else {
        // Seteamos las carreras de esa universidad
        this.carrerasDisponibles = this.carrerasPorUniversidad[uni] ?? [];
        carreraControl?.reset('');
      
        if (this.carrerasDisponibles.length > 0) {
          carreraControl?.enable({ emitEvent: false });
        } else {
          carreraControl?.disable({ emitEvent: false });
        }
      }
  });

  }

  private passwordsMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password === confirm
      ? null
      : { passwordMismatch: true };
  }

  passwordMismatch(): boolean {
    return this.form.hasError('passwordMismatch');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    const value = this.form.value;

    const payload = {
      email: value.email,
      password: value.password,
      perfil: {
        nombre: value.nombres,
        apellidos: value.apellidos,
        universidad: value.universidad,
        carrera: value.carrera,
        ciclo: Number(value.ciclo),
      },
      //rol: 'ROLE_FREE' // opcional, backend lo pone por defecto
    };

    this.authService.register(payload).subscribe({
      next: () => {
        // Crear biblioteca automáticamente para el nuevo usuario
        this.bibliotecaService.crearBiblioteca().subscribe({
          next: () => {
            this.loading.set(false);
            this.router.navigate(['/']);
          },
          error: (err: HttpErrorResponse) => {
            console.error('⚠️ Error al crear biblioteca (registro exitoso):', err);
            // Igual se permite
            this.loading.set(false);
            this.router.navigate(['/']);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        console.error('❌ Error al registrar:', err);
        this.serverError.set('Ocurrió un error al crear la cuenta.');
      }
    });
  }
}
