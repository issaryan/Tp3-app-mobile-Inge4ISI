// src/app/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './controlleurs/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Récupérer le token d'accès depuis le service d'authentification
  return from(authService.getAccessToken()).pipe(
    switchMap(accessToken => {
      // Cloner la requête pour y ajouter le token, si présent
      let clonedReq = req;
      if (accessToken) {
        clonedReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
        });
      }

      // Envoyer la requête et gérer les erreurs
      return next(clonedReq).pipe(
        catchError((error: any) => {
          // Vérifier si l'erreur est due à un token expiré (401 Unauthorized)
          if (error.status === 401) {
            return from(authService.getRefreshToken()).pipe(
              switchMap(refreshToken => {
                if (refreshToken) {
                  // Tenter de renouveler le token
                  return authService.refreshAccessToken().pipe(
                    switchMap(newToken => {
                      // Sauvegarder le nouveau token
                      authService.saveTokens({
                        accessToken: newToken.accessToken,
                        refreshToken: refreshToken as string // On conserve le même refreshToken
                      });

                      // Relancer la requête d'origine avec le nouveau token
                      const newReq = req.clone({
                        headers: req.headers.set('Authorization', `Bearer ${newToken.accessToken}`)
                      });
                      return next(newReq);
                    }),
                    catchError(refreshError => {
                      // Si le renouvellement échoue, déconnecter l'utilisateur
                      authService.logout();
                      return throwError(() => refreshError);
                    })
                  );
                }
                return throwError(() => error);
              })
            );
          }

          // Si une autre erreur survient, la renvoyer
          return throwError(() => error);
        })
      );
    })
  );
};
