// src/app/pages/login/login.page.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AuthService } from 'src/app/controlleurs/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  async login() {
    if (this.email && this.password && this.password.length >= 6) {
      this.authService.login({ email: this.email, password: this.password }).subscribe(
        async (response: any) => {
          await this.authService.saveTokens({ accessToken: response.accessToken, refreshToken: response.refreshToken });
          this.router.navigate(['/home']); // Redirige vers la page d'accueil après le login
        },
        error => {
          console.error('Erreur de connexion', error);
        }
      );
    } else {
      console.error('Email et mot de passe (min 6 caractères) requis');
    }
  }
}
