// src/app/features/recursos/components/success-modal/success-modal.component.ts
// CREAR NUEVO ARCHIVO

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onClose()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="success-icon">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="40" fill="#00C853"/>
            <path d="M25 40L35 50L55 30" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        
        <h2 class="modal-title">¡Recurso subido con éxito!</h2>
        <p class="modal-message">¡Gracias por tu contribución!</p>
        
        <button class="btn-close" (click)="onClose()">
          Cerrar
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-content {
      background: white;
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 500px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        transform: translateY(30px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .success-icon {
      margin: 0 auto 24px;
      animation: scaleIn 0.5s ease 0.2s both;
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
      }
      to {
        transform: scale(1);
      }
    }

    .modal-title {
      font-size: 28px;
      font-weight: 700;
      color: #000;
      margin: 0 0 12px;
      font-family: 'Poppins', sans-serif;
    }

    .modal-message {
      font-size: 16px;
      color: #555;
      margin: 0 0 32px;
      font-family: 'Poppins', sans-serif;
    }

    .btn-close {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 50px;
      padding: 14px 48px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'Poppins', sans-serif;
    }

    .btn-close:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
    }

    .btn-close:active {
      transform: translateY(0);
    }

    @media (max-width: 600px) {
      .modal-content {
        padding: 36px 24px;
        border-radius: 16px;
      }

      .modal-title {
        font-size: 24px;
      }

      .modal-message {
        font-size: 14px;
      }

      .success-icon svg {
        width: 60px;
        height: 60px;
      }
    }
  `]
})
export class SuccessModalComponent {
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}