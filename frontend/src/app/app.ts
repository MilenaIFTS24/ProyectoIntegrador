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

  // Empezamos en false para evitar el "flicker" (parpadeo) del footer al cargar
  public isFooterVisible = signal(false); 

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Usamos urlAfterRedirects para capturar el "/login" final 
      // aunque el usuario haya tipeado "/"
      this.updateVisibility(event.urlAfterRedirects || event.url);
    });
  }

  ngOnInit() {
    // Forzamos el chequeo inicial considerando la redirección
    this.updateVisibility(window.location.pathname);

    if (window.location.pathname.includes('/login')) {
      this.authService.clearSession();
    }
  }

  private updateVisibility(currentPath: string): void {
    const excludedPaths = ['/login', '/register', 'adminDashboard'];
    
    // CASO ESPECIAL: Si el path es la raíz "/" y sabemos que redirige a login,
    // o si el path contiene alguna de las palabras excluidas.
    const isExcluded = currentPath === '/' || excludedPaths.some(path => 
      currentPath.toLowerCase().includes(path.toLowerCase())
    );

    this.isFooterVisible.set(!isExcluded);
  }
}