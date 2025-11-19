import {Component, inject, OnInit, signal} from '@angular/core';
import {BibliotecaService} from "../../../../core/services/biblioteca.service";
import {BibliotecaRecursoResponse} from '../../../../core/models/biblioteca.model';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-lista-recursos',
  imports: [
    DatePipe
  ],
  templateUrl: './lista-recursos.component.html',
  styleUrl: './lista-recursos.component.css',
})
export class ListaRecursosComponent implements OnInit {
  private bibliotecaService = inject(BibliotecaService);
  private router = inject(Router);

  recursos = signal<BibliotecaRecursoResponse[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.cargarRecursos();
  }

  cargarRecursos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.bibliotecaService.obtenerBibliotecaUsuario().subscribe({
      next: (biblioteca) => {
        this.bibliotecaService.listarRecursos(biblioteca.id_biblioteca).subscribe({
          next: (recursos) => {
            this.recursos.set(recursos);
            this.loading.set(false);
          },
          error: (err: HttpErrorResponse) => {
            this.error.set('Error al cargar los recursos');
            this.loading.set(false);
            console.error(err);
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.error.set('Error al obtener la biblioteca');
        this.loading.set(false);
        console.error(err);
      }
    });
  }

  verRecurso(recurso: BibliotecaRecursoResponse): void {
    this.router.navigate(['/recursos', recurso.id_recurso]);
  }
}
