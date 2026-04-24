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

  ngOnInit() {
    // Lógica para detectar la ruta
    const url = window.location.pathname;
    this.isAuthPage.set(url.includes('/login') || url.includes('/register'));
  }

  constructor() {
    // 1. Detectar la ruta apenas se crea el componente (Para el F5)
    const currentUrl = window.location.pathname;
    this.isAuthPage.set(currentUrl.includes('/login') || currentUrl.includes('/register'));

    // 2. Detectar cambios de ruta mientras navegamos
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isAuthPage.set(url.includes('/login') || url.includes('/register'));
    });
  }

  logout() {
    this.authService.logout();
  }
}