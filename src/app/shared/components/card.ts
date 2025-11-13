import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card-container">

      <div class="card-header">
        <img src="logo.png" alt="Logo RecolectaEdu" class="card-logo-img">
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
      max-width: 450px;
      font-family: 'Poppins', sans-serif;
    }

    .card-container {
      background-color: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      padding: 30px 40px;
      z-index: 1;
      text-align: center;
    }

    .card-header {
      margin-bottom: 25px;
    }

    .card-logo-img {
      height: 60px;
      margin-right: 10px;
      vertical-align: middle;
    }

    .card-logo-text {
      font-size: 28px;
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
