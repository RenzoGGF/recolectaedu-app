import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FaIconComponent],
  template: `
    <div class="login-container">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="header">
          <h2 class="title">¡Nos alegra verte otra vez!</h2>
        </div>

        <!-- Botón de Google -->
        <div class="row one-col">
          <button type="button" class="btn-social btn-google">
            <fa-icon [icon]="iconGoogle"></fa-icon>
            <span>Continuar con Google</span>
          </button>
        </div>

        <div class="divider">
          <span>o continúa con tu correo</span>
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

        <!-- Contraseña -->
        <div class="row one-col">
          <div class="field">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              formControlName="password"
              placeholder="contraseña"
            />
          </div>
        </div>

        <!-- Errores -->
        <p class="error" *ngIf="form.invalid && form.touched">
          Revisa que el correo y la contraseña sean válidos.
        </p>
        <p class="error" *ngIf="serverError()">
          {{ serverError() }}
        </p>

        <!-- Footer: link + botón -->
        <div class="row footer-row">
          <span class="no-account">
            ¿Aún no tienes cuenta?
            <a [routerLink]="['/auth/register']">Regístrate</a>
          </span>

          <button
            type="submit"
            class="btn-submit"
            [disabled]="form.invalid || loading()"
          >
            {{ loading() ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          </button>
        </div>

        <div class="row one-col forgot-row">
          <a [routerLink]="['/auth/forgot-password']" class="forgot-link">
            Olvidé mi contraseña
          </a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .login-container {
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

    .header {
      text-align: left;
    }

    .title {
      font-size: 22px;
      font-weight: 700;
      color: #000000;
      margin: 0 0 4px;
    }

    .subtitle {
      font-size: 14px;
      font-weight: 400;
      color: #555555;
      margin: 0;
    }

    .row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      width: 100%;
    }

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

    .forgot-row {
      justify-content: flex-end;
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

    input {
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

    /* Botón Google */
    .btn-social {
      width: 100%;
      padding: 12px 18px;
      border-radius: 999px;
      border: 1px solid #e7e7ee;
      background-color: #ffffff;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-sizing: border-box;
    }

    .btn-social:hover {
      background-color: #f9f9f9;
    }

    .btn-google {
      color: #db4437;
    }

    .divider {
      position: relative;
      text-align: center;
      font-size: 12px;
      color: #777777;
      margin: 4px 0 8px;
    }

    .divider::before,
    .divider::after {
      content: "";
      position: absolute;
      top: 50%;
      width: 40%;
      height: 1px;
      background-color: #e7e7ee;
    }

    .divider::before {
      left: 0;
    }

    .divider::after {
      right: 0;
    }

    .no-account {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
    }

    .no-account a {
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
      background-color: #00c43b;
      color: #ffffff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
      min-width: 160px;
    }

    .btn-submit:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .forgot-link {
      font-size: 13px;
      font-weight: 500;
      color: #000000;
      text-decoration: underline;
      cursor: pointer;
    }

    .error {
      color: #c0392b;
      font-size: 12px;
      margin: 0;
    }

    @media (max-width: 900px) {
      .login-container {
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
export class LoginComponent {
  iconGoogle = faGoogle;

  form: FormGroup;
  loading = signal(false);
  serverError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.loading.set(false);
        // ruta al base
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
        this.serverError.set('Correo o contraseña incorrectos.');
      }
    });
  }
}
