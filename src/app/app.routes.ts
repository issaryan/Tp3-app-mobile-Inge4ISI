// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { AuthGuard } from './auth.guard';
import { LoginPage } from './vues/login/login.page';
import { ArtisteComponent } from './vues/artiste/artiste.component';

export const routes: Routes = [
  { path: 'login', component: LoginPage },
  { path: 'home', component: HomePage, canActivate: [AuthGuard] },
  { path: 'artiste/:id', component: ArtisteComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./vues/login/login.page').then( m => m.LoginPage)
  },
];
