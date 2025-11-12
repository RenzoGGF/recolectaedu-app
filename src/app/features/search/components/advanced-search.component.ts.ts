import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-advanced-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FaIconComponent
  ],
  template: `
    <div class="modal-overlay" (click)="onClose()"></div>

    <div class="modal-container">

      <div class="modal-header">
        <h2>Búsqueda avanzada</h2>
        <button class="btn-close" (click)="onClose()">
          <fa-icon [icon]="iconClose"></fa-icon>
        </button>
      </div>

      <form [formGroup]="filterForm" (ngSubmit)="onSubmit()">

        <div class="form-row">
          <div class="form-group">
            <label for="orden">Orden</label>
            <select id="orden" formControlName="orden">
              <option value="recientes">Recientes</option>
              <option value="relevantes">Relevantes</option>
            </select>
          </div>

          <div class="form-group">
            <label for="universidad">Universidad</label>
            <input type="text" id="universidad" formControlName="universidad">
          </div>
        </div>

        <div class="form-group full-width">
          <label for="autor">Autor</label>
          <input type="text" id="autor" formControlName="autor">
        </div>

        <div class="modal-actions">
          <button type="submit" class="btn btn-apply">
            APLICAR FILTROS Y BUSCAR
          </button>
          <button type="button" class="btn btn-clear" (click)="onClear()">
            Limpiar filtros
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
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }

    .modal-container {
      position: relative;
      z-index: 1001;
      background-color: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 60px 60px;
      width: 100%;
      max-width: 600px;
      color: #000;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-header h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #000;
      margin: 0;
      /* Centramos el título (el botón de cerrar lo empuja) */
      flex: 1;
      text-align: center;
      margin-left: 30px; /* Espacio para compensar el botón X */
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #8A8A8A;
      cursor: pointer;
    }

    /* --- INICIO: CAMBIOS DE CSS --- */

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 15px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .form-group.full-width {
      flex-basis: 100%;
    }
    .form-group label {
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 5px;
      color: #555;
    }
    .form-group input,
    .form-group select {
      width: 100%;
      padding: 12px 14px;
      /* 1. Borde más oscuro */
      border: 1px solid #AAA;
      /* 2. Más redondeado */
      border-radius: 25px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    }

    /* 3. Estilos de los botones */
    .modal-actions {
      display: flex;
      /* 4. Apilados verticalmente */
      flex-direction: column;
      /* 5. Centrados */
      align-items: center;
      gap: 10px; /* Espacio entre botones */
      margin-top: 20px;
      padding-top: 0;
      border-top: none; /* Sin línea divisoria */
    }
    .btn {
      padding: 12px 20px; /* Un poco más de padding vertical */
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      /* 6. Ancho fijo para ambos botones */
      width: 250px;
      max-width: 100%;
    }

    /* 7. ¡BOTÓN AZUL! */
    .btn-clear {
      background-color: #0D8EFF; /* Azul de tu paleta */
      color: #FFFFFF;
    }
    .btn-clear:hover {
      background-color: #0056b3; /* Azul más oscuro */
    }

    .btn-apply {
      background-color: #32CD32; /* Verde de tu paleta */
      color: #FFFFFF;
    }
    .btn-apply:hover {
      background-color: #228B22;
    }
  `]
})
export class AdvancedSearchComponent {
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<any>();

  filterForm: FormGroup;
  iconClose = faTimes;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      orden: ['recientes'],
      universidad: [''],
      autor: ['']
    });
  }

  onClose() {
    this.close.emit();
  }

  onClear() {
    this.filterForm.reset({
      orden: 'recientes',
      universidad: '',
      autor: ''
    });
  }

  onSubmit() {
    if (this.filterForm.valid) {
      console.log('Filtros a aplicar:', this.filterForm.value);
      this.apply.emit(this.filterForm.value);
    }
  }
}
