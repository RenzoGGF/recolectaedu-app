import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CardComponent } from '../components/card';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CardComponent],
  template: `
    <div class="auth-page-container">
      <div class="background-pattern"></div>

      <app-card>
        <router-outlet></router-outlet>
      </app-card>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      min-height: 100vh;
      font-family: 'Poppins', sans-serif;
    }

    .auth-page-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #240334;
      position: relative;
      overflow: hidden;
      padding: 20px;
    }

    .background-pattern {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('/assets/images/background.png');
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      opacity: 0.5;
      z-index: 0;
    }

    app-card {
      position: relative;
      z-index: 1;
    }
  `]
})
export class AuthLayoutComponent {}
