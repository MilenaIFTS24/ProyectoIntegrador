import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Inyectamos el AuthService para acceder a los Signals
  // Lo ponemos público para que el HTML pueda leerlo directamente
  public authService = inject(AuthService);
  private router = inject(Router);

  isAuthPage = signal(false);
  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Si la URL es /login o /register, solo muestro logo y nombre
      const url = event.urlAfterRedirects;
      this.isAuthPage.set(url.includes('/login') || url.includes('/register'));
    });
  }
  logout() {
    this.authService.logout();
  }
}