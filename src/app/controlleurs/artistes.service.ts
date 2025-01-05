import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IArtiste } from '../models/iartiste';
import { IPaginatedResponse } from '../models/ipaginated-response';
import { INoteAverage } from '../models/inote-average';

@Injectable({
  providedIn: 'root'
})
export class ArtistesService {
  // URL de base de l'API
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  /**
   * Récupère la liste paginée des artistes
   * @param page Numéro de la page
   * @param limit Nombre d'éléments par page
   */
  getArtistes(page: number = 1, limit: number = 10): Observable<IPaginatedResponse<IArtiste>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<IPaginatedResponse<IArtiste>>(`${this.API_URL}/artistes`, { params });
  }

  /**
 * Note un artiste
 * @param idArtiste L'identifiant de l'artiste
 * @param utilisateurId L'identifiant de l'utilisateur
 * @param note La note attribuée (1-5)
 */
noterArtiste(idArtiste: number, utilisateurId: string, note: number): Observable<any> {
  return this.http.post(`${this.API_URL}/notes`, {
    id_artiste: idArtiste,
    utilisateur_id: utilisateurId,
    note: note
  });
}

/**
 * Suit un artiste
 * @param idArtiste L'identifiant de l'artiste
 * @param utilisateurId L'identifiant de l'utilisateur
 */
suivreArtiste(idArtiste: number, utilisateurId: string): Observable<any> {
  return this.http.post(`${this.API_URL}/abonnements`, {
    id_artiste: idArtiste,
    utilisateur_id: utilisateurId
  });
}

  /**
   * Récupère la note moyenne d'un artiste
   * @param idArtiste L'identifiant de l'artiste
   */
  getNoteAverage(idArtiste: number): Observable<number> {
    return this.http.get<INoteAverage>(`${this.API_URL}/notes/${idArtiste}/average`)
      .pipe(
        map(response => response.average_note)
      );
  }


  /**
   * Vérifie si un utilisateur suit un artiste
   * @param idArtiste L'identifiant de l'artiste
   * @param utilisateurId L'identifiant de l'utilisateur
   */
  checkAbonnement(idArtiste: number, utilisateurId: string): Observable<boolean> {
    return this.http.get<{isFollowing: boolean}>(`${this.API_URL}/abonnements/${idArtiste}/check/${utilisateurId}`)
      .pipe(
        map(response => response.isFollowing)
      );
  }

  /**
   * Recherche des artistes par nom ou nom de scène
   * @param query Le terme de recherche
   */
  searchArtistes(query: string): Observable<IArtiste[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<IPaginatedResponse<IArtiste>>(`${this.API_URL}/artistes`, { params })
      .pipe(
        map(response => response.data)
      );
  }

  /**
   * Calcule le nombre d'années en exercice d'un artiste
   * @param dateDebut La date de début de carrière
   */
  calculerAnneesExercice(dateDebut: Date): number {
    const debut = new Date(dateDebut);
    const maintenant = new Date();
    return maintenant.getFullYear() - debut.getFullYear();
  }
}
