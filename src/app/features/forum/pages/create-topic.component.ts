import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl
} from '@angular/forms';

import {
  topicTitleValidators,
  topicContentValidators
} from '../validators/topic-validators';

import { ForumService } from '../../../core/services/forum.service';
import { AuthService } from '../../../core/services/auth.service';
import { ForoTopic, ForoTopicRequest } from '../../../core/models/forum.model';

@Component({
  selector: 'app-create-topic',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal-overlay" (click)="onClose()"></div>

    <div class="modal-container">
      <form [formGroup]="topicForm" (ngSubmit)="onSubmit()">

        <div class="form-group">
          <label for="titulo">Título</label>
          <input
            id="titulo"
            type="text"
            formControlName="titulo"
            placeholder="¿Qué es esta página web?"
            [class.is-invalid]="titulo?.invalid && (titulo?.dirty || titulo?.touched)">

          @if (titulo?.invalid && (titulo?.dirty || titulo?.touched)) {
            <div class="error-message">
              @if (titulo?.hasError('required')) {
                El título es requerido.
              }
              @if (titulo?.hasError('minlength')) {
                El título debe tener al menos 10 caracteres.
              }
            </div>
          }
        </div>

        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            formControlName="contenido"
            placeholder="Estoy buscando donde encontrar recursos..."
            [class.is-invalid]="contenido?.invalid && (contenido?.dirty || contenido?.touched)"
            rows="6">
          </textarea>

          @if (contenido?.invalid && (contenido?.dirty || contenido?.touched)) {
            <div class="error-message">
              @if (contenido?.hasError('required')) {
                El contenido es requerido.
              }
              @if (contenido?.hasError('minlength')) {
                El contenido debe tener al menos 20 caracteres.
              }
            </div>
          }
        </div>

        @if(serverError()) {
          <p class="error-message server-error">{{ serverError() }}</p>
        }

        <div class="modal-actions">
          <button
            type="submit"
            class="btn-create"
            [disabled]="topicForm.invalid || loading()">
            {{ loading() ? 'Creando...' : 'CREAR' }}
          </button>
        </div>

      </form>
    </div>
  `,
  styles: [`
    :host {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      font-family: 'Poppins', sans-serif;
    }
    .modal-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(5px);
    }
    .modal-container {
      position: relative;
      z-index: 1001;
      background-color: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 30px;
      width: 100%;
      max-width: 500px;
      color: #000;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-group label {
      font-size: 1rem;
      font-weight: 700;
      color: #000;
    }
    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #AAA;
      border-radius: 8px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      box-sizing: border-box;
    }
    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }
    .form-group input.is-invalid,
    .form-group textarea.is-invalid {
      border-color: #c0392b;
    }
    .error-message {
      font-size: 0.85rem;
      color: #c0392b;
      font-weight: 500;
    }
    .server-error {
      text-align: center;
      font-weight: 600;
    }
    .modal-actions {
      display: flex;
      justify-content: center;
      margin-top: 10px;
    }
    .btn-create {
      background-color: #32CD32;
      color: #FFFFFF;
      border: none;
      border-radius: 50px;
      padding: 12px 40px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
    }
    .btn-create:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class CreateTopicComponent {
  @Output() close = new EventEmitter<void>();
  @Output() topicCreated = new EventEmitter<ForoTopic>();

  private fb = inject(FormBuilder);
  private forumService = inject(ForumService);
  private authService = inject(AuthService);

  loading = signal(false);
  serverError = signal<string | null>(null);

  topicForm: FormGroup;

  constructor() {
    this.topicForm = this.fb.group({
      titulo: ['', topicTitleValidators],
      contenido: ['', topicContentValidators]
    });
  }

  get titulo(): AbstractControl | null {
    return this.topicForm.get('titulo');
  }
  get contenido(): AbstractControl | null {
    return this.topicForm.get('contenido');
  }

  // --- Métodos de Acción ---
  onClose(): void {
    this.close.emit();
  }

  onSubmit(): void {
    if (this.topicForm.invalid) {
      this.topicForm.markAllAsTouched();
      return;
    }

    if (!this.authService.isAuthenticated()) {
      this.serverError.set('Debes iniciar sesión para crear un tema.');
      return;
    }

    this.loading.set(true);
    this.serverError.set(null);

    const payload: ForoTopicRequest = this.topicForm.value;

    this.forumService.createTopic(payload).subscribe({
      next: (newTopic) => {
        this.loading.set(false);
        this.topicCreated.emit(newTopic);
      },
      error: (err) => {
        this.loading.set(false);
        if (err.status === 400) {
          this.serverError.set('Datos inválidos. Revisa el formulario.');
        } else if (err.status === 401 || err.status === 403) {
          this.serverError.set('No tienes permiso para realizar esta acción.');
        } else {
          this.serverError.set('Error en el servidor. Intenta de nuevo.');
        }
      }
    });
  }
}
