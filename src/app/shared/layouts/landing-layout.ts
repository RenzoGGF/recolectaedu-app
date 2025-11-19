import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../components/footer';
import { NavbarUserComponent } from '../components/navbar-user';


@Component({
  selector: 'app-landing-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FooterComponent,NavbarUserComponent ],
  template: `
    <app-navbar-user></app-navbar-user>

    <main>
        <router-outlet></router-outlet>
      </main>

      <app-footer></app-footer>
    `,
  styles: [`

    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
    }
  `]
})
export class LandingLayoutComponent {}
