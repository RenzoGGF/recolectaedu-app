// src/app/features/recursos/pages/publicar-recurso/publicar-recurso.component.ts

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ResourceService } from '../../../../core/services/resource.service';
import { 
  RecursoCreateRequest, 
  RecursoArchivoCreateRequest,
  PERIODOS_ACADEMICOS,
  TIPOS_RECURSO,
  FORMATOS_RECURSO,
  MAX_FILE_SIZE_MB,
  ALLOWED_FILE_EXTENSIONS
} from '../../../../core/models/recurso-create.model';

type TipoRecurso = 'ARCHIVO' | 'ENLACE' | 'TEXTO';

@Component({
  selector: 'app-publicar-recurso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './publicar-recurso.component.html',
  styleUrl: './publicar-recurso.component.css'
})
export class PublicarRecursoComponent {
  private readonly fb = inject(FormBuilder);
  private readonly resourceService = inject(ResourceService);
  private readonly router = inject(Router);

  // Signals para control de flujo
  currentStep = signal<1 | 2 | 3>(1);
  selectedTipo = signal<TipoRecurso | null>(null);
  selectedFile = signal<File | null>(null);
  loading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  // Opciones para dropdowns
  periodosAcademicos = PERIODOS_ACADEMICOS;
  tiposRecurso = TIPOS_RECURSO;
  
  // Años académicos (últimos 10 años + próximo año)
  anosAcademicos = computed(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 10; i++) {
      years.push(currentYear - i);
    }
    return years;
  });

  // Formulario principal
  recursoForm!: FormGroup;

  // Computed para validaciones
  canProceedToStep2 = computed(() => this.selectedTipo() !== null);
  
  canProceedToStep3 = computed(() => {
    const tipo = this.selectedTipo();
    if (tipo === 'ARCHIVO') {
      return this.selectedFile() !== null;
    }
    return true; // Para ENLACE y TEXTO no se requiere nada en paso 2
  });

  constructor() {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.recursoForm = this.fb.group({
      // Clasificación académica
      universidad: ['', [Validators.required, Validators.minLength(3)]],
      carrera: ['', [Validators.required, Validators.minLength(3)]],
      nombreCurso: ['', [Validators.required, Validators.minLength(3)]],
      
      // Datos del recurso
      titulo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      tipo: ['', Validators.required],
      ano: ['', [Validators.required, Validators.min(1900), Validators.max(2100)]],
      periodo: ['', Validators.required],
      
      // Contenido (condicional según tipo)
      contenido: ['']
    });
  }

  // ==================== PASO 1: Seleccionar Tipo ====================
  
  selectTipo(tipo: TipoRecurso): void {
    this.selectedTipo.set(tipo);
    this.errorMessage.set(null);
    
    // Configurar validaciones según tipo
    const contenidoControl = this.recursoForm.get('contenido');
    
    if (tipo === 'TEXTO') {
      contenidoControl?.setValidators([Validators.required, Validators.minLength(50)]);
    } else if (tipo === 'ENLACE') {
      contenidoControl?.setValidators([
        Validators.required,
        Validators.pattern(/^https?:\/\/.+/)
      ]);
    } else {
      // ARCHIVO no usa el campo contenido del formulario
      contenidoControl?.clearValidators();
    }
    contenidoControl?.updateValueAndValidity();
    
    this.goToStep(2);
  }

  // ==================== PASO 2: Subir Contenido ====================
  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private handleFile(file: File): void {
    this.errorMessage.set(null);
    
    // Validar archivo
    const validation = this.resourceService.validateFile(file);
    
    if (!validation.valid) {
      this.errorMessage.set(validation.error || 'Archivo inválido');
      this.selectedFile.set(null);
      return;
    }
    
    this.selectedFile.set(file);
  }

  removeFile(): void {
    this.selectedFile.set(null);
  }

  getFileSize(bytes: number): string {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  // ==================== PASO 3: Formulario de Metadatos ====================

    onSubmit(): void {
    // ⭐ DEBUGGING: Ver estado del formulario
    console.log('=== DEBUGGING FORMULARIO ===');
    console.log('Formulario válido:', this.recursoForm.valid);
    console.log('Valores del formulario:', this.recursoForm.value);
    console.log('Errores del formulario:', this.recursoForm.errors);
    console.log('Tipo seleccionado:', this.selectedTipo());
    console.log('Archivo seleccionado:', this.selectedFile());
    
    // Mostrar errores de cada campo
    Object.keys(this.recursoForm.controls).forEach(key => {
        const control = this.recursoForm.get(key);
        if (control?.errors) {
        console.log(`Campo "${key}" tiene errores:`, control.errors);
        }
    });
    console.log('=========================');
    
    // Marcar todos los campos como touched para mostrar errores
    this.markFormGroupTouched(this.recursoForm);
    
    if (this.recursoForm.invalid) {
        this.errorMessage.set('Por favor completa todos los campos correctamente.');
        console.error('❌ Formulario inválido - revisa la consola para ver los errores');
        return;
    }
    
    const tipo = this.selectedTipo();
    if (!tipo) {
        this.errorMessage.set('Debe seleccionar un tipo de recurso.');
        return;
    }
    
    this.loading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    
    // Preparar datos base
    const formValue = this.recursoForm.value;
    const baseData = {
        id_usuario: 1, // TODO: Obtener del AuthService cuando esté implementado
        universidad: formValue.universidad,
        carrera: formValue.carrera,
        nombreCurso: formValue.nombreCurso,
        titulo: formValue.titulo,
        descripcion: formValue.descripcion,
        tipo: formValue.tipo,
        ano: parseInt(formValue.ano, 10),
        periodo: parseInt(formValue.periodo, 10)
    };
    
    console.log('📤 Enviando datos:', baseData);
    
    if (tipo === 'ARCHIVO') {
        this.submitFileResource(baseData);
    } else {
        this.submitJsonResource(baseData, tipo);
    }
    }

    private submitFileResource(baseData: any): void {
    const file = this.selectedFile();
    if (!file) {
        this.errorMessage.set('Debe seleccionar un archivo.');
        this.loading.set(false);
        return;
    }
    
    const metadata: RecursoArchivoCreateRequest = {
        ...baseData,
        formato: FORMATOS_RECURSO.ARCHIVO
    };
    
    console.log('📤 Request ARCHIVO:');
    console.log('  - Archivo:', file.name, file.size, 'bytes');
    console.log('  - Metadata:', metadata);
    
    this.resourceService.createResourceFile(file, metadata).subscribe({
        next: (response) => {
        console.log('✅ Respuesta exitosa:', response);
        this.successMessage.set('¡Recurso publicado exitosamente!');
        this.loading.set(false);
        
        setTimeout(() => {
            this.router.navigate(['/search']);
        }, 2000);
        },
        error: (error) => {
        console.error('❌ Error completo:', error);
        console.error('Status:', error.status);
        console.error('Message:', error.message);
        console.error('Error body:', error.error);
        
        this.errorMessage.set(
            error.error?.message || 'Error al publicar el recurso. Intenta nuevamente.'
        );
        this.loading.set(false);
        }
    });
    }

private submitJsonResource(baseData: any, tipo: TipoRecurso): void {
  const formValue = this.recursoForm.value;
  
  const requestData: RecursoCreateRequest = {
    ...baseData,
    contenido: formValue.contenido,
    formato: tipo === 'ENLACE' ? FORMATOS_RECURSO.ENLACE : FORMATOS_RECURSO.TEXTO
  };
  
  console.log('📤 Request JSON completo:', requestData);
  
  this.resourceService.createResourceJson(requestData).subscribe({
    next: (response) => {
      console.log('✅ Respuesta exitosa:', response);
      this.successMessage.set('¡Recurso publicado exitosamente!');
      this.loading.set(false);
      
      setTimeout(() => {
        this.router.navigate(['/search']); // Cambiar a /search por ahora
      }, 2000);
    },
    error: (error) => {
      console.error('❌ Error completo:', error);
      console.error('Status:', error.status);
      console.error('Message:', error.message);
      console.error('Error body:', error.error);
      
      this.errorMessage.set(
        error.error?.message || 'Error al publicar el recurso. Intenta nuevamente.'
      );
      this.loading.set(false);
    }
  });
}

  // ==================== Navegación entre pasos ====================

  goToStep(step: 1 | 2 | 3): void {
    this.currentStep.set(step);
    this.errorMessage.set(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack(): void {
    const current = this.currentStep();
    if (current > 1) {
      this.goToStep((current - 1) as 1 | 2 | 3);
    } else {
      this.router.navigate(['/search']);
    }
  }

  cancel(): void {
    if (confirm('¿Estás seguro de cancelar? Se perderán los datos ingresados.')) {
      this.router.navigate(['/search']);
    }
  }

  // ==================== Helpers ====================

  hasError(field: string): boolean {
    const control = this.recursoForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(field: string): string {
    const control = this.recursoForm.get(field);
    
    if (!control || !control.errors) return '';
    
    const errors = control.errors;
    
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) {
      const min = errors['minlength'].requiredLength;
      return `Mínimo ${min} caracteres`;
    }
    if (errors['maxlength']) {
      const max = errors['maxlength'].requiredLength;
      return `Máximo ${max} caracteres`;
    }
    if (errors['pattern']) return 'Formato inválido. Debe comenzar con http:// o https://';
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    
    return 'Campo inválido';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Getters para usar en el template
  get isArchivoType(): boolean {
    return this.selectedTipo() === 'ARCHIVO';
  }

  get isEnlaceType(): boolean {
    return this.selectedTipo() === 'ENLACE';
  }

  get isTextoType(): boolean {
    return this.selectedTipo() === 'TEXTO';
  }
}