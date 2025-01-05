import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistesService } from 'src/app/controlleurs/artistes.service';
import { IArtiste } from 'src/app/models/iartiste';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-artiste',
  templateUrl: './artiste.component.html',
  styleUrls: ['./artiste.component.scss'],
  imports: [IonicModule],
  standalone: true,
})
export class ArtisteComponent implements OnInit {
  artiste: IArtiste | null = null;
  anneesExercice: number = 0;
  utilisateurId: string = '123'; // Remplacez par l'ID de l'utilisateur connecté
  hasNoted: boolean = false;
  isFollowing: boolean = false;
  currentRating: number = 0; // Note actuellement sélectionnée par l'utilisateur

  constructor(
    private route: ActivatedRoute,
    private artistesService: ArtistesService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadArtiste(+id);
    }
  }

  loadArtiste(id: number) {
    this.artistesService.getArtistes().subscribe((response) => {
      this.artiste = response.data.find((artiste) => artiste.id === id) || null;
      if (this.artiste) {
        this.anneesExercice = this.artistesService.calculerAnneesExercice(this.artiste.date_debut);

        // Vérifier si l'utilisateur a déjà noté l'artiste
        this.artistesService.getNoteAverage(id).subscribe((average) => {
          this.artiste!.average_note = average;
        });

        // Vérifier si l'utilisateur est abonné
        this.artistesService.checkAbonnement(id, this.utilisateurId).subscribe((isFollowing) => {
          this.isFollowing = isFollowing;
        });
      }
    });
  }

  // Définir la note sélectionnée par l'utilisateur
  setRating(rating: number) {
    this.currentRating = rating;
  }

  // Noter l'artiste
  noterArtiste() {
    if (this.artiste && !this.hasNoted && this.currentRating > 0) {
      this.artistesService.noterArtiste(this.artiste.id!, this.utilisateurId, this.currentRating).subscribe(() => {
        this.hasNoted = true;
        this.loadArtiste(this.artiste!.id!);
      });
    }
  }

  // S'abonner à l'artiste
  suivreArtiste() {
    if (this.artiste && !this.isFollowing) {
      this.artistesService.suivreArtiste(this.artiste.id!, this.utilisateurId).subscribe(() => {
        this.isFollowing = true;
      });
    }
  }
}
