import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faEllipsisH, faUser } from '@fortawesome/free-solid-svg-icons';

import { AuthService } from '../../../core/services/auth.service';
import { ForumService } from '../../../core/services/forum.service';
import { ForoTopic } from '../../../core/models/forum.model';

import { CreateTopicComponent } from './create-topic.component';

@Component({
  selector: 'app-forum-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FaIconComponent, CreateTopicComponent],
  template: `
    <div class="forum-container">

      <div class="forum-header">
        <h1>¡Bienvenido al foro de RecolectaEdu, recuerda ser respetuoso!</h1>
        @if (authService.isAuthenticated()) {
          <button class="btn-create-topic" (click)="openCreateTopicModal()">
            Crear un tema
          </button>
        } @else {
          <button class="btn-create-topic-disabled" (click)="redirectToLogin()">
            Inicia sesión para crear un tema
          </button>
        }
      </div>

      <div class="topic-list">
        @for (topic of topics(); track topic.id_foro) {
          <div class="topic-card">
            <div class="author-info">
              <div class="author-icon"><fa-icon [icon]="iconUser"></fa-icon></div>
              <span class="author-name">{{ topic.nombre }} {{ topic.apellido }}</span>
              <span class="topic-time">- {{ topic.creado_el | date:'short' }}</span>
            </div>
            <a [routerLink]="['/foro', topic.id_foro]" class="topic-title">
              {{ topic.titulo }}
            </a>
            <p class="topic-content">{{ topic.contenido }}</p>
            <button class="btn-options"><fa-icon [icon]="iconOptions"></fa-icon></button>
          </div>
        } @empty {
          <p class="empty-message">{{ loadingMessage() }}</p>
        }
      </div>
    </div>

    @if (isCreateTopicModalOpen()) {
      <app-create-topic
        (close)="closeCreateTopicModal()"
        (topicCreated)="onTopicCreated($event)"
      />
    }
  `,
  // (Tus estilos no cambian)
  styles: [`
    :host {
      display: block;
      font-family: 'Poppins', sans-serif;
    }
    .forum-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .forum-header h1 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #000;
      margin: 0;
    }
    .btn-create-topic, .btn-create-topic-disabled {
      border: none;
      border-radius: 50px;
      padding: 10px 20px;
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
    }
    .btn-create-topic {
      background-color: #32CD32;
      color: #FFFFFF;
    }
    .btn-create-topic-disabled {
      background-color: #E7E7EE;
      color: #555;
    }
    .topic-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .empty-message {
      text-align: center;
      padding: 20px;
      color: #555;
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
      margin-bottom: 10px;
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
      font-size: 1.2rem;
      font-weight: 700;
      color: #0D8EFF;
      text-decoration: none;
      margin-bottom: 8px;
      display: inline-block;
    }
    .topic-title:hover {
      text-decoration: underline;
    }
    .topic-content {
      font-size: 1rem;
      color: #333;
      margin: 0;
      line-height: 1.5;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .btn-options {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: #8A8A8A;
      font-size: 1rem;
      cursor: pointer;
    }
  `]
})
export class ForumListComponent implements OnInit {
  iconUser = faUser;
  iconOptions = faEllipsisH;

  authService = inject(AuthService);
  private forumService = inject(ForumService);
  private router = inject(Router);

  topics = signal<ForoTopic[]>([]);
  loadingMessage = signal('Cargando temas del foro...');
  isCreateTopicModalOpen = signal(false);

  constructor() {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.loadingMessage.set('Cargando temas...');
    this.topics.set([]);

    this.forumService.getAllTopics().subscribe({
      next: (data) => {
        this.topics.set(data);
        if (data.length === 0) {
          this.loadingMessage.set('Aún no hay temas en el foro. ¡Crea el primero!');
        }
      },
      error: (err) => {
        console.error('Error al cargar temas:', err);
        this.loadingMessage.set('Error al cargar los temas.');
      }
    });
  }

  openCreateTopicModal(): void {
    this.isCreateTopicModalOpen.set(true);
  }

  redirectToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  closeCreateTopicModal(): void {
    this.isCreateTopicModalOpen.set(false);
  }

  onTopicCreated(newTopic: ForoTopic): void {
    this.closeCreateTopicModal();
    this.topics.update(currentTopics => [newTopic, ...currentTopics]);
    this.router.navigate(['/foro', newTopic.id_foro], {
      queryParams: { created: 'true' }
    });
  }
}
