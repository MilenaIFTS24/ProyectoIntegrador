import { Component, inject, signal } from '@angular/core';
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
export class App {
  public authService = inject(AuthService);
  public router = inject(Router);
  constructor() { }

  //Que el footer no se muestre en la pantalla de admin
  showFooter(): boolean {
  // Retorna falso si la URL actual contiene 'adminDashboard'
  return !this.router.url.includes('adminDashboard');
}
}
