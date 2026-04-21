import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    if (window.location.pathname.includes('/login')) {
      this.authService.clearSession();
    }
  }
  showFooter(): boolean {
    const url = this.router.url;

    // Ocultar si:
    // 1. Es la pantalla de admin
    // 2. Es login
    // 3. Es registro
    const isExcludedPage = url.includes('adminDashboard') ||
      url.includes('login') ||
      url.includes('register');

    return !isExcludedPage;
  }

}
