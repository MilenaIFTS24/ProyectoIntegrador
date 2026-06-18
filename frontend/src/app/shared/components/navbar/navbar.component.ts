import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);

  public isAuthPage = signal(false);

  constructor() {
    // 1. Evaluación inicial al instanciar el componente
    this.updateAuthStatus(window.location.pathname);

    // 2. Suscripción a los cambios de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // urlAfterRedirects para captar la ruta final real
      const url = event.urlAfterRedirects || event.url;
      this.updateAuthStatus(url);
    });
  }

  ngOnInit() {
    // Doble chequeo por ciclo de vida
    this.updateAuthStatus(window.location.pathname);
  }

  private updateAuthStatus(url: string): void {
    const currentUrl = url.toLowerCase();
    const isLoginOrRegister = currentUrl.includes('/login') || currentUrl.includes('/register');
    
    this.isAuthPage.set(isLoginOrRegister);
  }

  logout() {
    this.authService.logout();
  }
}