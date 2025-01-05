import { Component, OnInit } from '@angular/core';
import { ArtistesService } from 'src/app/controlleurs/artistes.service';
import { IArtiste } from 'src/app/models/iartiste';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-liste-artistes',
  templateUrl: './liste-artistes.component.html',
  styleUrls: ['./liste-artistes.component.scss'],
  imports: [IonicModule, RouterLink],
  standalone: true,
})
export class ListeArtistesComponent implements OnInit {
  artistes: IArtiste[] = [];
  currentPage: number = 1;
  limit: number = 10;
  totalArtistes: number = 0;
  isLoading: boolean = false;
  skeletonItems: number[] = Array(5).fill(0);
  utilisateurId: string = '123'; // Remplacez par l'ID de l'utilisateur connecté

  constructor(private artistesService: ArtistesService) {}

  ngOnInit() {
    this.loadArtistes();
  }

  loadArtistes() {
    this.isLoading = true;
    this.artistesService.getArtistes(this.currentPage, this.limit).subscribe((response) => {
      this.artistes = [...this.artistes, ...response.data];
      this.totalArtistes = response.total;

      // Récupérer la note moyenne et l'état d'abonnement pour chaque artiste
      this.artistes.forEach((artiste) => {
        this.artistesService.getNoteAverage(artiste.id!).subscribe((average) => {
          artiste.average_note = average;
        });

        this.artistesService.checkAbonnement(artiste.id!, this.utilisateurId).subscribe((isFollowing) => {
          artiste.isFollowing = isFollowing;
        });
      });

      this.isLoading = false;
    });
  }

  loadMoreArtistes(event: any) {
    if (this.artistes.length < this.totalArtistes) {
      this.currentPage++;
      this.loadArtistes();
      event.target.complete();
    } else {
      event.target.disabled = true;
    }
  }
}
