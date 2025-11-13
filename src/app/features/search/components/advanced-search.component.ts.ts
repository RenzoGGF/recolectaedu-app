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
            <select id="orden" formControlName="ordenarPor">
              <option value="RECIENTES">Recientes</option>
              <option value="RELEVANTES">Relevantes</option>
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
    .main-content {
      margin-right: 320px;
      padding-right: 20px;
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
      flex: 1;
      text-align: center;
      margin-left: 30px;
    }
    .btn-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #8A8A8A;
      cursor: pointer;
    }
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
      border: 1px solid #AAA;
      border-radius: 25px;
      font-size: 1rem;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
    }
    .modal-actions {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      margin-top: 20px;
      padding-top: 0;
      border-top: none;
    }
    .btn {
      padding: 12px 20px;
      border: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      width: 250px;
      max-width: 100%;
    }
    .btn-clear {
      background-color: #0D8EFF;
      color: #FFFFFF;
    }
    .btn-clear:hover {
      background-color: #0056b3;
    }
    .btn-apply {
      background-color: #32CD32;
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
      ordenarPor: 'RECIENTES',
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
