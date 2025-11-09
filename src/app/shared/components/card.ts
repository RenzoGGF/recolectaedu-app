import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-container">

      <div class="card-header">
        <img src="/assets/images/logo.png" alt="Logo RecolectaEdu" class="card-logo-img">
        <span class="card-logo-text">RecolectaEdu</span>
      </div>

      <div class="card-content">
        <ng-content></ng-content>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      max-width: 450px; /* Ancho máximo de la tarjeta (ajusta según Figma) */
      font-family: 'Poppins', sans-serif;
    }

    .card-container {
      background-color: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 30px 40px; /* Ajusta el padding interno de la tarjeta */
      z-index: 1;
      text-align: center; /* Centra el logo y el texto de bienvenida */
    }

    .card-header {
      margin-bottom: 25px;
    }

    .card-logo-img {
      height: 60px; /* Tamaño del logo en la tarjeta (ajusta según Figma) */
      margin-right: 10px;
      vertical-align: middle;
    }

    .card-logo-text {
      font-size: 28px; /* Tamaño del texto del logo (ajusta según Figma) */
      font-weight: 700;
      color: #240334;
      vertical-align: middle;
    }

    .card-content {

      text-align: left;
    }
  `]
})
export class CardComponent {}
