import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
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

  public isNavbarVisible = signal(false);
  public isFooterVisible = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.updateVisibility(event.urlAfterRedirects || event.url);
    });
  }

  ngOnInit() {
    this.updateVisibility(window.location.pathname);
  }

  // Actualizar visibilidad del navbar segun la pagina
  private updateVisibility(currentPath: string): void {
    const authPaths = ['/login', '/register'];
    const isAdminDashboard = currentPath.toLowerCase().includes('admindashboard');

    const isAuthRoute = authPaths.some(path =>
      currentPath.toLowerCase().includes(path.toLowerCase())
    );
    this.isNavbarVisible.set(true);
    this.isFooterVisible.set(!isAuthRoute && !isAdminDashboard);
  }
}