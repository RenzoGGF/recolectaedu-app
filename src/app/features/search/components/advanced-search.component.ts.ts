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
            <select id="orden" formControlName="ordenarPor" class="custom-input">
              <option value="RECIENTES">Recientes</option>
              <option value="RELEVANTES">Relevantes</option>
            </select>
          </div>

          <div class="form-group">
            <label for="universidad">Universidad</label>
            <select id="universidad" formControlName="universidad" class="custom-input">
              <option value="" disabled selected>Selecciona una universidad</option>
              @for (uni of universidades; track uni) {
                <option [value]="uni">{{ uni }}</option>
              }
            </select>
          </div>
        </div>

        <div class="form-group full-width">
          <label for="autor">Autor</label>
          <input
            type="text"
            id="autor"
            formControlName="autor"
            class="custom-input"
            placeholder="Nombre del autor">
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
      border-radius: 20px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      padding: 40px;
      width: 100%;
      max-width: 650px;
      color: #000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .modal-header {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 30px;
      position: relative;
    }

    .modal-header h2 {
      font-size: 1.8rem;
      font-weight: 700;
      color: #240334;
      margin: 0;
    }

    .btn-close {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #8A8A8A;
      cursor: pointer;
      transition: color 0.2s;
    }
    .btn-close:hover {
      color: #000;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .form-group.full-width {
      margin-bottom: 30px;
    }

    .form-group label {
      font-size: 0.95rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
      margin-left: 5px;
    }

    .custom-input {
      width: 100%;
      padding: 12px 20px;
      border: 1px solid #CCC;
      border-radius: 50px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      background-color: #F9F9F9;
      transition: all 0.2s ease;
      box-sizing: border-box;
      outline: none;
      appearance: none;
    }

    select.custom-input {
      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
      background-repeat: no-repeat;
      background-position: right 20px top 50%;
      background-size: 12px auto;
    }

    .custom-input:focus {
      border-color: #0D8EFF; /* Azul al enfocar */
      background-color: #FFF;
      box-shadow: 0 0 0 3px rgba(13, 142, 255, 0.1);
    }

    /* Botones */
    .modal-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
    }

    .btn {
      width: 280px;
      max-width: 100%;
      padding: 14px 20px;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      transition: transform 0.1s ease, box-shadow 0.2s ease;
    }

    .btn:active {
      transform: scale(0.98);
    }

    .btn-apply {
      background-color: #32CD32;
      color: #FFFFFF;
      box-shadow: 0 4px 10px rgba(50, 205, 50, 0.3);
    }
    .btn-apply:hover {
      background-color: #28a728;
    }

    .btn-clear {
      background-color: #0D8EFF;
      color: #FFFFFF;
      box-shadow: 0 4px 10px rgba(13, 142, 255, 0.3);
    }
    .btn-clear:hover {
      background-color: #0b7ad8;
    }
  `]
})
export class AdvancedSearchComponent {
  @Output() close = new EventEmitter<void>();
  @Output() apply = new EventEmitter<any>();

  filterForm: FormGroup;
  iconClose = faTimes;

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

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      ordenarPor: ['RECIENTES'],
      universidad: [''],
      autor: ['']
    });
  }

  onClose() {
    this.close.emit();
  }

  onClear() {
    this.filterForm.reset({
      ordenarPor: 'RECIENTES',
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
