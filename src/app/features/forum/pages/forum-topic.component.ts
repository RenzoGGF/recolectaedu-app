import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEllipsisH, faUser } from '@fortawesome/free-solid-svg-icons';
import { catchError, of, tap } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { ForumService } from '../../../core/services/forum.service';
import { ForoTopic, ForoComment } from '../../../core/models/forum.model';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forum-topic',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, ReactiveFormsModule],
  template: `
    <div class="topic-detail-container">

      @if (topic()) {
        <div class="topic-card">
          <div class="author-info">
            <div class="author-icon">
              <fa-icon [icon]="iconUser"></fa-icon>
            </div>
            <span class="author-name">{{ topic()!.nombre }} {{ topic()!.apellido }}</span>
            <span class="topic-time">- {{ topic()!.creado_el | date:'short' }}</span>
          </div>

          <h1 class="topic-title">{{ topic()!.titulo }}</h1>

          <p class="topic-content">{{ topic()!.contenido }}</p>

          @if (isOwner()) {
            <div class="topic-actions">
              <button class="btn btn-edit">EDITAR</button>
              <button class="btn btn-delete">ELIMINAR</button>
            </div>
          }
        </div>
      } @else {
        <p class="empty-message">{{ loadingMessage() }}</p>
      }

      <div class="comment-form-card">
        <form [formGroup]="commentForm" (ngSubmit)="onPostComment()">
          <textarea
            formControlName="contenido"
            placeholder="Escribe un comentario"
            rows="4">
          </textarea>
          <div class="comment-actions">
            <button type="submit" class="btn btn-respond" [disabled]="commentForm.invalid">
              RESPONDER
            </button>
          </div>
        </form>
      </div>

      <div class="comments-section">
        <h2>Comentarios</h2>
        @for (comment of comments(); track comment.id) {
          <div class="comment-card">
            <div class="author-info">
              <div class="author-icon">
                <fa-icon [icon]="iconUser"></fa-icon>
              </div>
              <span class="author-name">{{ comment.nombreAutor }} {{ comment.apellidoAutor }}</span>
              <span class="topic-time">- {{ comment.tiempo }}</span>
            </div>
            <p class="topic-content">{{ comment.contenido }}</p>
          </div>
        }
      </div>

    </div>

    @if (showToast()) {
      <div class="toast-notification">
        ¡Tema creado!
      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Poppins', sans-serif;
    }
    .topic-card {
      position: relative;
      background-color: #FFFFFF;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border-bottom: 1px solid #E7E7EE;
    }
    .author-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 15px;
    }
    .author-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background-color: #E5DFFF;
      color: #240334;
      display: grid;
      place-items: center;
      font-size: 0.8rem;
    }
    .author-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: #000;
    }
    .topic-time {
      font-size: 0.9rem;
      color: #555;
    }
    .topic-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0D8EFF;
      text-decoration: none;
      margin: 0 0 10px 0;
      display: inline-block;
    }
    .topic-content {
      font-size: 1rem;
      color: #333;
      margin: 0;
      line-height: 1.6;
    }
    .topic-actions {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .btn {
      border: none;
      border-radius: 50px;
      padding: 8px 16px;
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .btn-edit {
      background-color: #32CD32;
      color: #FFFFFF;
    }
    .btn-delete {
      background-color: #0D8EFF;
      color: #FFFFFF;
    }
    .comment-form-card {
      margin-top: 30px;
      background-color: #FFFFFF;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }
    .comment-form-card textarea {
      width: 100%;
      border: 1px solid #AAA;
      border-radius: 8px;
      padding: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 1rem;
      box-sizing: border-box;
      resize: vertical;
    }
    .comment-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
    .btn-respond {
      background-color: #0D8EFF;
      color: #FFFFFF;
      border: none;
      border-radius: 50px;
      padding: 10px 20px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .btn-respond:disabled {
      opacity: 0.6;
    }
    .comments-section {
      margin-top: 30px;
    }
    .comments-section h2 {
      font-size: 1.2rem;
      font-weight: 700;
      color: #000;
      margin-bottom: 15px;
    }
    .comment-card {
      background-color: #FFFFFF;
      border-radius: 12px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      margin-bottom: 15px;
    }
    .empty-message {
      text-align: center;
      padding: 20px;
      color: #555;
    }
    .toast-notification {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #FFFFFF;
      color: #000;
      padding: 15px 30px;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
      font-weight: 700;
      z-index: 2000;
    }
  `]
})
export class ForumTopicComponent implements OnInit {
  iconUser = faUser;

  private route = inject(ActivatedRoute);
  private forumService = inject(ForumService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  topic = signal<ForoTopic | null>(null);
  loadingMessage = signal('Cargando tema...');
  showToast = signal(false);
  comments = signal<ForoComment[]>([]);
  commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      contenido: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.comments.set([
      {
        id: 1,
        nombreAutor: 'Usuario12',
        apellidoAutor: '',
        tiempo: 'hace 1 minutos',
        contenido: '¡Es una pagina para encontrar documentos!'
      }
    ]);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const topicId = +params['id'];
      if (topicId) {
        this.loadTopic(topicId);
      } else {
        this.loadingMessage.set('No se encontró el ID del tema.');
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['created'] === 'true') {
        this.showToast.set(true);
        setTimeout(() => this.showToast.set(false), 3000);
      }
    });
  }

  loadTopic(id: number) {
    this.loadingMessage.set('Cargando tema...');
    this.forumService.getTopicById(id).pipe(
      tap(data => {
        this.topic.set(data);
      }),
      catchError(err => {
        console.error('Error al cargar el tema:', err);
        this.loadingMessage.set('No se pudo cargar el tema. Es posible que no exista.');
        return of(null);
      })
    ).subscribe();
  }


  isOwner(): boolean {
    const currentUserEmail = this.authService.authState()?.email;

    const topicAuthorEmail = this.topic()?.emailAutor;

    if (!currentUserEmail || !topicAuthorEmail) {
      return false;
    }

    return currentUserEmail === topicAuthorEmail;
  }

  onPostComment() {
    if (this.commentForm.invalid) return;

    console.log('Comentario a enviar:', this.commentForm.value.contenido);

    const newComment: ForoComment = {
      id: Math.random(),
      nombreAutor: this.authService.authState()?.name || 'Tú',
      apellidoAutor: '',
      tiempo: 'ahora mismo',
      contenido: this.commentForm.value.contenido
    };
    this.comments.update(current => [newComment, ...current]);

    this.commentForm.reset();
  }
}
