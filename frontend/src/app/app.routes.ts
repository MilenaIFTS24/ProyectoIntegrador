import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
    // --- RUTAS PÚBLICAS ---
    { path: "", loadComponent: () => import('./features/home/home-page/home-page.component').then(m => m.HomePageComponent) },
    { path: "login", loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: "register", loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    { path: "contacto", loadComponent: () => import('./features/contact/contact-page/contact-page.component').then(m => m.ContactPageComponent) },
    { path: "products", loadComponent: () => import('./features/products/products-list/products-list.component').then(m => m.ProductsListComponent) },
    { path: "products/:id", loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
    { path: "events", loadComponent: () => import('./features/events/events-list/events-list.component').then(m => m.EventsListComponent) },
    { path: "events/:id", loadComponent: () => import('./features/events/event-detail/event-detail.component').then(m => m.EventDetailComponent) },

    // --- RUTA DE ADMINISTRACIÓN (Protegida por Login Y Rol Admin) ---
    {
        path: "adminDashboard",
        canActivate: [authGuard, roleGuard], // Primero verifica sesión, luego si es admin
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        children: [
            { path: "adminDashboardHome", loadComponent: () => import('./features/admin/admin-dashboard-home/admin-dashboard-home.component').then(m => m.AdminDashboardHomeComponent) },
            { path: "manageEvents", loadComponent: () => import('./features/admin/manage-events/manage-events.component').then(m => m.ManageEventsComponent) },
            { path: "manageOffers", loadComponent: () => import('./features/admin/manage-offers/manage-offers.component').then(m => m.ManageOffersComponent) },
            { path: "manageReservations", loadComponent: () => import('./features/admin/manage-reservations/manage-reservations.component').then(m => m.ManageReservationsComponent) },
            { path: "manageUsers", loadComponent: () => import('./features/admin/manage-users/manage-users.component').then(m => m.ManageUsersComponent) },
            { path: "", redirectTo: "adminDashboardHome", pathMatch: "full" }
        ]
    },

    // --- RUTA DE USUARIO (Protegida solo por Login) ---
    {
        path: "userDashboard",
        canActivate: [authGuard], // Cualquier usuario logueado puede entrar
        loadComponent: () => import('./features/user/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
        children: [
            { path: "userDashboardHome", loadComponent: () => import('./features/user/user-dashboard-home/user-dashboard-home.component').then(m => m.UserDashboardHomeComponent) },
            { path: "myReservations", loadComponent: () => import('./features/user/my-reservations/my-reservations.component').then(m => m.MyReservationsComponent) },
            { path: "makeReservation", loadComponent: () => import('./features/user/make-reservation/make-reservation.component').then(m => m.MakeReservationComponent) },
            { path: "", redirectTo: "userDashboardHome", pathMatch: "full" }
        ]
    },

    { path: '**', redirectTo: '', pathMatch: 'full' }
];