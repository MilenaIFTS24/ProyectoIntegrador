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
    this.updateAuthStatus(window.location.pathname);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.updateAuthStatus(url);
    });
  }

  ngOnInit() {
    this.updateAuthStatus(window.location.pathname);
  }

  // Actualizar visibilidad segun la pagina
  private updateAuthStatus(url: string): void {
    const currentUrl = url.toLowerCase();
    const isLoginOrRegister = currentUrl.includes('/login') || currentUrl.includes('/register');

    this.isAuthPage.set(isLoginOrRegister);
  }

  // Cerrar sesión
  logout() {
    this.authService.logout();
  }
}