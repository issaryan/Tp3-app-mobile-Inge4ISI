// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken'; // Clé pour le token d'accès
  private readonly REFRESH_TOKEN_KEY = 'refreshToken'; // Clé pour le token de rafraîchissement

  constructor(
    private http: HttpClient,
    private router: Router,
    private storage: Storage,
    private platform: Platform
  ) {
    this.initStorage();
  }

  private async initStorage() {
    await this.storage.create();
  }

  /**
   * Envoie les informations de connexion au backend et récupère les tokens.
   * @param credentials Objet contenant l'email et le mot de passe.
   * @returns Un observable contenant la réponse du backend.
   */
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post('http://localhost:3000/auth/mobile/login', credentials);
  }

  /**
   * Stocke les tokens JWT dans le localStorage ou Ionic Storage en fonction de la plateforme.
   * @param tokens Objet contenant `accessToken` et `refreshToken`.
   */
  async saveTokens(tokens: { accessToken: string; refreshToken: string }): Promise<void> {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      await this.storage.set(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      await this.storage.set(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
    }
  }

  /**
   * Récupère le token d'accès depuis le localStorage ou Ionic Storage en fonction de la plateforme.
   * @returns Le token d'accès ou null s'il n'existe pas.
   */
  async getAccessToken(): Promise<string | null> {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      return await this.storage.get(this.ACCESS_TOKEN_KEY);
    } else {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
  }

  /**
   * Récupère le token de rafraîchissement depuis le localStorage ou Ionic Storage en fonction de la plateforme.
   * @returns Le token de rafraîchissement ou null s'il n'existe pas.
   */
  async getRefreshToken(): Promise<string | null> {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      return await this.storage.get(this.REFRESH_TOKEN_KEY);
    } else {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
  }

  /**
   * Supprime les tokens JWT du localStorage ou Ionic Storage en fonction de la plateforme (déconnexion).
   */
  async logout(): Promise<void> {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      await this.storage.remove(this.ACCESS_TOKEN_KEY);
      await this.storage.remove(this.REFRESH_TOKEN_KEY);
    } else {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }

  /**
   * Vérifie si un utilisateur est connecté (en se basant sur la présence du token d'accès).
   * @returns True si l'utilisateur est connecté, sinon false.
   */
  async isAuthenticated(): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      return false;
    }

    // Décoder le token pour vérifier son expiration
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  }

  /**
   * Renouvelle le token d'accès à l'aide du token de rafraîchissement.
   * @returns Un observable contenant le nouveau token d'accès.
   */
  refreshAccessToken(): Observable<{ accessToken: string }> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Aucun token de rafraîchissement disponible');
    }

    return this.http.post<{ accessToken: string }>('http://localhost:3000/auth/refresh-token', {
      refreshToken
    });
  }
}
