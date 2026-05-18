<<<<<<< HEAD
import { Component, inject, OnInit, signal } from '@angular/core';
=======
import { Component, inject, signal } from '@angular/core';
>>>>>>> 5dcb2499a6bfe74d4e56c63bda162e8efec77b4a
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
<<<<<<< HEAD
export class AppComponent implements OnInit {
  public authService = inject(AuthService);
  private router = inject(Router);
=======
export class App {
  public authService = inject(AuthService);
>>>>>>> 5dcb2499a6bfe74d4e56c63bda162e8efec77b4a

  ngOnInit() {
    if (window.location.pathname.includes('/login')) {
      this.authService.clearSession();
    }
  }
  showFooter(): boolean {
<<<<<<< HEAD
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

=======
  // Retorna falso si la URL actual contiene 'adminDashboard'
  return !this.router.url.includes('adminDashboard');
}
>>>>>>> 5dcb2499a6bfe74d4e56c63bda162e8efec77b4a
}
