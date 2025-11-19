import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Membresia, Plan } from '../../../core/models/membresia.model';
import { MembresiaService } from '../../../core/services/membresia.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { UserProfile } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-membership-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="membership-wrapper">
      <section class="membership-card">
        <header class="membership-header">
          <div class="title-block">
            <h1 class="title">Membresía Premium</h1>
          </div>

          <div class="current-plan">
            <span class="label">Plan actual:</span>

            <span
              class="badge"
              [ngClass]="{
                'badge-free': currentPlanType === 'FREE',
                'badge-premium': currentPlanType !== 'FREE'
              }"
            >
              {{ currentPlanLabel }}
            </span>

            <small
              *ngIf="activeMembership && activeMembership.endsAt"
              class="renew-text"
            >
              Vence el {{ activeMembership.endsAt | date:'dd/MM/yyyy' }}
            </small>
          </div>
        </header>

        <div *ngIf="errorMessage" class="error-box">
          {{ errorMessage }}
        </div>

        <section class="plans-grid">
          <!-- Plan Mensual -->
          <article class="plan">
            <h2 class="plan-name">Plan Mensual</h2>
            <p class="plan-price">
              S/ 9.90 <span class="plan-period">/ mes</span>
            </p>

            <ul class="plan-features">
              <li>Descargas ilimitadas de recursos durante el mes.</li>
              <li>Soporte básico por correo.</li>
            </ul>

            <button
              type="button"
              class="btn-primary"
              [disabled]="saving || currentPlanType !== 'FREE'"
              (click)="onSubscribe('MONTHLY')"
            >
              {{
                currentPlanType !== 'FREE'
                  ? 'Ya tienes una membresía activa'
                  : saving && pendingPlan === 'MONTHLY'
                  ? 'Procesando...'
                  : 'Elegir plan mensual'
              }}
            </button>
          </article>

          <!-- Plan Anual -->
          <article class="plan plan-highlight">
            <div class="ribbon">Más elegido</div>
            <h2 class="plan-name">Plan Anual</h2>
            <p class="plan-price">
              S/ 89.10 <span class="plan-period">/ año</span>
            </p>
            <p class="plan-note">Ahorra más de 3 meses respecto al plan mensual.</p>

            <ul class="plan-features">
              <li>Descargas ilimitadas todo el año.</li>
              <li>Soporte preferencial.</li>
            </ul>

            <button
              type="button"
              class="btn-primary btn-primary-strong"
              [disabled]="saving || currentPlanType !== 'FREE'"
              (click)="onSubscribe('ANNUAL')"
            >
              {{
                currentPlanType !== 'FREE'
                  ? 'Ya tienes una membresía activa'
                  : saving && pendingPlan === 'ANNUAL'
                  ? 'Procesando...'
                  : 'Elegir plan anual'
              }}
            </button>
          </article>
        </section>

        <footer class="membership-footer">
          <p class="footer-text">
            Podrás cambiar o cancelar tu membresía en cualquier momento desde esta misma sección.
          </p>
          <a class="footer-link" [routerLink]="['/profile']">
            Volver a mi perfil
          </a>
        </footer>
      </section>
    </div>
  `,
  styles: [`
    .membership-wrapper {
      max-width: 960px;
      margin: 0 auto;
      font-family: 'Poppins', sans-serif;
    }

    .membership-card {
      background-color: #ffffff;
      border-radius: 24px;
      padding: 24px 28px 26px;
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
    }

    .membership-header {
      display: flex;
      justify-content: space-between;
      gap: 16px;
      border-bottom: 1px solid #e5e5f0;
      padding-bottom: 16px;
      margin-bottom: 18px;
    }

    .title-block {
      max-width: 70%;
    }

    .title {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
      color: #000000;
    }

    .subtitle {
      margin: 4px 0 0;
      font-size: 13px;
      color: #555555;
    }

    .current-plan {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      justify-content: center;
      gap: 4px;
    }

    .current-plan .label {
      font-size: 12px;
      color: #666666;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .badge-free {
      background-color: #f0f4ff;
      color: #0052cc;
    }

    .badge-premium {
      background-color: #ffe6c2;
      color: #b35a00;
    }

    .renew-text {
      font-size: 11px;
      color: #555;
    }

    .error-box {
      margin-top: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background-color: #ffe5e5;
      color: #b30000;
      font-size: 12px;
    }

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 18px;
      margin-top: 10px;
    }

    .plan {
      position: relative;
      border-radius: 18px;
      border: 1px solid #e3e3f3;
      padding: 16px 18px 18px;
      background-color: #fafbff;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .plan-highlight {
      border-color: #007bff;
      background: linear-gradient(145deg, #f2f7ff, #fdf9ff);
    }

    .ribbon {
      position: absolute;
      top: 10px;
      right: 14px;
      background-color: #ffb800;
      color: #000;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 999px;
    }

    .plan-name {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
    }

    .plan-price {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      color: #000;
    }

    .plan-period {
      font-size: 13px;
      font-weight: 500;
      color: #444;
    }

    .plan-note {
      margin: 0;
      font-size: 12px;
      color: #444;
    }

    .plan-features {
      margin: 6px 0 0;
      padding-left: 18px;
      font-size: 13px;
      color: #333;
      flex: 1;
    }

    .plan-features li + li {
      margin-top: 4px;
    }

    .btn-primary {
      margin-top: 10px;
      align-self: flex-start;
      padding: 8px 18px;
      border-radius: 999px;
      border: none;
      background-color: #007bff;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-primary:hover {
      background-color: #0065cf;
    }

    .btn-primary-strong {
      background-color: #00c43b;
    }

    .btn-primary-strong:hover {
      background-color: #06a532;
    }

    .membership-footer {
      border-top: 1px solid #e5e5f0;
      margin-top: 18px;
      padding-top: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 12px;
    }

    .footer-text {
      margin: 0;
      color: #555;
    }

    .footer-link {
      color: #007bff;
      text-decoration: none;
      font-weight: 600;
      font-size: 12px;
    }

    .footer-link:hover {
      text-decoration: underline;
    }

    @media (max-width: 900px) {
      .membership-card {
        padding: 20px 18px 22px;
        border-radius: 18px;
      }

      .membership-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .title-block {
        max-width: 100%;
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }

      .membership-footer {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class MembershipPageComponent implements OnInit {
  private membresiaService = inject(MembresiaService);
  private usuarioService = inject(UsuarioService);

  loading = false;
  saving = false;
  errorMessage: string | null = null;

  currentPlanType: 'FREE' | Plan = 'FREE';
  currentPlanLabel = 'FREE';
  activeMembership: Membresia | null = null;
  pendingPlan: Plan | null = null;

  private currentUserId: number | null = null;

  ngOnInit(): void {
    this.loading = true;
    this.errorMessage = null;

    this.usuarioService.getCurrentProfile().subscribe({
      next: (profile: UserProfile) => {
        this.currentUserId = profile.id_usuario;
        this.loadMembership();
      },
      error: (error) => {
        console.error('❌ Error al obtener perfil para membresía:', error);
        this.errorMessage = 'No se pudo obtener la información del usuario.';
        this.loading = false;
      }
    });
  }

  private loadMembership(): void {
    if (!this.currentUserId) {
      this.errorMessage = 'No se pudo determinar el usuario actual.';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.errorMessage = null;

    this.membresiaService.getByUsuario(this.currentUserId).subscribe({
      next: (list) => {
        const active = list.find((m) => m.status === 'ACTIVE') || null;
        this.activeMembership = active;

        if (!active) {
          this.currentPlanType = 'FREE';
          this.currentPlanLabel = 'FREE';
        } else if (active.plan === 'MONTHLY') {
          this.currentPlanType = 'MONTHLY';
          this.currentPlanLabel = 'Premium mensual';
        } else {
          this.currentPlanType = 'ANNUAL';
          this.currentPlanLabel = 'Premium anual';
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar membresía:', error);
        this.errorMessage = 'Error al cargar tu membresía. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  onSubscribe(plan: Plan): void {
    if (this.currentPlanType !== 'FREE') {
    this.errorMessage = 'Ya tienes una membresía activa.';
    return;
    }
    if (!this.currentUserId) {
      this.errorMessage = 'No se pudo determinar el usuario actual.';
      return;
    }

    this.saving = true;
    this.pendingPlan = plan;
    this.errorMessage = null;

    this.membresiaService.create(this.currentUserId, plan, true).subscribe({
      next: () => {
        this.saving = false;
        this.pendingPlan = null;
        this.loadMembership();
      },
      error: (error) => {
        console.error('❌ Error al suscribirse a membresía:', error);
        this.errorMessage = 'Ocurrió un error al activar tu membresía.';
        this.saving = false;
        this.pendingPlan = null;
      }
    });
  }
}
