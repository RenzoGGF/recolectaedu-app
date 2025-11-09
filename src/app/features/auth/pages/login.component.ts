import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    FaIconComponent
  ],
  template: `
    <div class="login-form-container">
      <h2 class="welcome-title">¡Nos alegramos de verte otra vez!</h2>

      <button class="btn-social btn-google">
        <fa-icon [icon]="iconGoogle"></fa-icon>
        GOOGLE
      </button>
      <button class="btn-social btn-microsoft">
        <fa-icon [icon]="iconMicrosoft"></fa-icon>
        MICROSOFT
      </button>

      <div class="divider"></div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">

        <div class="form-group">
          <input
            type="email"
            placeholder="tucorreoelectronico@cualquiermail.com"
            formControlName="email">
        </div>

        <div class="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            formControlName="password">
        </div>

        <button typeS="submit" class="btn btn-submit" [disabled]="loginForm.invalid">
          Iniciar sesión
        </button>

      </form>

      <div class="links-footer">
        <a [routerLink]="['/auth/register']">Regístrate</a>
        <a [routerLink]="['/auth/forgot-password']">Olvidé mi contraseña</a>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    .login-form-container {
      text-align: center;
      font-family: 'Poppins', sans-serif;
    }

    .welcome-title {
      font-weight: 600;
      font-size: 18px;
      color: #000000;
      margin-bottom: 25px;
    }

    .btn-social {
      width: 100%;
      padding: 12px;
      margin-bottom: 15px;
      border: 1px solid #E7E7EE;
      background-color: #FFFFFF;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
    .btn-social:hover {
      background-color: #f9f9f9;
    }
    .btn-social fa-icon {
      font-size: 18px;
    }
    .btn-google { color: #DB4437; }
    .btn-microsoft { color: #0078D4; }


    .divider {
      height: 1px;
      width: 100%;
      background-color: #E7E7EE;
      margin: 25px 0;
    }


    .form-group {
      margin-bottom: 15px;
      text-align: left;
    }
    .form-group input {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid #E7E7EE;
      border-radius: 8px;
      font-size: 14px;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      background-color: #32CD32;
      color: #FFFFFF;
      margin-top: 10px;
    }
    .btn-submit:hover {
      background-color: #228B22;
    }
    .btn-submit:disabled {
      background-color: #8A8A8A;
      cursor: not-allowed;
    }

    .links-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
    }
    .links-footer a {
      color: #000000;
      text-decoration: none;
      font-size: 14px;
      font-weight: 600;
    }
    .links-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  iconGoogle = faGoogle;
  iconMicrosoft = faMicrosoft;
  loginForm;
  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }


  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Formulario enviado:', this.loginForm.value);
    }
  }
}
