import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

import {
  faTwitter,
  faFacebook,
  faLinkedin,
  faInstagram,
  faYoutube
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FaIconComponent],
  template: `<footer class="footer-container">
      <div class="footer-links">
        <a href="#">Preguntas Frecuentes</a>
        <a href="#">Contacto</a>
      </div>

      <div class="footer-social-copyright">
        <div class="footer-social">
          <a href="#" aria-label="Twitter"><fa-icon [icon]="iconTwitter"></fa-icon></a>
          <a href="#" aria-label="Facebook"><fa-icon [icon]="iconFacebook"></fa-icon></a>
          <a href="#" aria-label="LinkedIn"><fa-icon [icon]="iconLinkedIn"></fa-icon></a>
          <a href="#" aria-label="Instagram"><fa-icon [icon]="iconInstagram"></fa-icon></a>
          <a href="#" aria-label="YouTube"><fa-icon [icon]="iconYouTube"></fa-icon></a>
        </div>
        <div class="footer-copyright">
          <p>Copyright © 2025</p>
        </div>
      </div>
    </footer>`,
  styles: [`
    :host {
      display: block;
      width: 100%;
      font-family: 'Poppins', sans-serif;
    }

    .footer-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #240334;
      color: #FFFFFF;
      padding: 20px 40px;
    }

    .footer-links {
      display: flex;
      gap: 25px;
    }

    .footer-links a {
      color: #FFFFFF;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }

    .footer-links a:hover {
      text-decoration: underline;
    }

    .footer-social-copyright {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .footer-social {
      display: flex;
      gap: 15px;
    }

    .footer-social a {
      color: #FFFFFF;
      text-decoration: none;
      font-size: 24px;
    }

    .footer-copyright p {
      margin: 0;
      font-weight: 600;
      font-size: 10px;
      white-space: nowrap;
    }
  `]
})

export class FooterComponent {
  iconTwitter = faTwitter;
  iconFacebook = faFacebook;
  iconLinkedIn = faLinkedin;
  iconInstagram = faInstagram;
  iconYouTube = faYoutube;
}
