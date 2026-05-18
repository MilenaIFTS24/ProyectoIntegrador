import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
<<<<<<< HEAD
    // --- RUTAS PÚBLICAS ---
    { path: "login", loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: "register", loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    { path: "", loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    
    // ... resto de rutas públicas (contacto, products, etc)
=======
    { path: "", loadComponent: () => import('./features/auth/login/login.component').then(m => LoginComponent) }, //dirijo al login
    { path: "login", loadComponent: () => import('./features/auth/login/login.component').then(m => LoginComponent) },
    { path: "register", loadComponent: () => import('./features/auth/register/register.component').then(m => RegisterComponent) },
    { path: "contacto", loadComponent: () => import('./features/contact/contact-page/contact-page.component').then(m => ContactPageComponent) },
    { path: "products", loadComponent: () => import('./features/products/products-list/products-list.component').then(m => ProductsListComponent) },
    { path: "products/:id", loadComponent: () => import('./features/products/product-detail/product-detail.component').then(m => ProductDetailComponent) },
    { path: "events", loadComponent: () => import('./features/events/events-list/events-list.component').then(m => EventsListComponent) },
    { path: "events/:id", loadComponent: () => import('./features/events/event-detail/event-detail.component').then(m => EventDetailComponent) },
    {
        path: "adminDashboard", loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => AdminDashboardComponent), children:
            [
                { path: "adminDashboardHome", loadComponent: () => import('./features/admin/admin-dashboard-home/admin-dashboard-home.component').then(m => AdminDashboardHomeComponent) },
                { path: "manageEvents", loadComponent: () => import('./features/admin/manage-events/manage-events.component').then(m => ManageEventsComponent) },
                { path: "manageOffers", loadComponent: () => import('./features/admin/manage-offers/manage-offers.component').then(m => ManageOffersComponent) },
                { path: "manageProducts", loadComponent: () => import('./features/admin/manage-products/manage-products.component').then(m => ManageProductsComponent) },
                { path: "manageReservations", loadComponent: () => import('./features/admin/manage-reservations/manage-reservations.component').then(m => ManageReservationsComponent) },
                { path: "manageUsers", loadComponent: () => import('./features/admin/manage-users/manage-users.component').then(m => ManageUsersComponent) },
                {
                    path: "",
                    redirectTo: "adminDashboardHome",
                    pathMatch: "full"
                }
            ]
    },
    {
        path: "userDashboard", loadComponent: () => import('./features/user/user-dashboard/user-dashboard.component').then(m => UserDashboardComponent), children:
            [
                { path: "userDashboardHome", loadComponent: () => import('./features/user/user-dashboard-home/user-dashboard-home.component').then(m => UserDashboardHomeComponent) },
                { path: "myReservations", loadComponent: () => import('./features/user/my-reservations/my-reservations.component').then(m => MyReservationsComponent) },
                { path: "makeReservation", loadComponent: () => import('./features/user/make-reservation/make-reservation.component').then(m => MakeReservationComponent) },
                {
                    path: "",
                    redirectTo: "userDashboardHome",
                    pathMatch: "full"
                }
            ]
    },
    { 
        path:'**', 
        redirectTo:'',
        pathMatch: 'full'
    }
>>>>>>> 5dcb2499a6bfe74d4e56c63bda162e8efec77b4a

    // --- RUTA DE ADMINISTRACIÓN ---
    {
        path: "adminDashboard",
        canActivate: [authGuard, roleGuard],
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        children: [
            { path: "adminDashboardHome", loadComponent: () => import('./features/admin/admin-dashboard-home/admin-dashboard-home.component').then(m => m.AdminDashboardHomeComponent) },
            { path: "manageEvents", loadComponent: () => import('./features/admin/manage-events/manage-events.component').then(m => m.ManageEventsComponent) },
            { path: "manageOffers", loadComponent: () => import('./features/admin/manage-offers/manage-offers.component').then(m => m.ManageOffersComponent) },
            { path: "manageProducts", loadComponent: () => import('./features/admin/manage-products/manage-products.component').then(m => m.ManageProductsComponent) },
            { path: "manageReservations", loadComponent: () => import('./features/admin/manage-reservations/manage-reservations.component').then(m => m.ManageReservationsComponent) },
            { path: "manageUsers", loadComponent: () => import('./features/admin/manage-users/manage-users.component').then(m => m.ManageUsersComponent) },
            { path: "", redirectTo: "adminDashboardHome", pathMatch: "full" }
        ]
    },

    // --- RUTA DE USUARIO ---
    {
        path: "userDashboard",
        canActivate: [authGuard],
        loadComponent: () => import('./features/user/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent),
        children: [
            { path: "userDashboardHome", loadComponent: () => import('./features/user/user-dashboard-home/user-dashboard-home.component').then(m => m.UserDashboardHomeComponent) },
            { path: "myReservations", loadComponent: () => import('./features/user/my-reservations/my-reservations.component').then(m => m.MyReservationsComponent) },
            { path: "makeReservation", loadComponent: () => import('./features/user/make-reservation/make-reservation.component').then(m => m.MakeReservationComponent) },
            { path: "", redirectTo: "userDashboardHome", pathMatch: "full" }
        ]
    },

    // Si no encuentra la ruta, redigire al home
    { path: '**', redirectTo: '', pathMatch: 'full' }
];