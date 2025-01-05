import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { ListeArtistesComponent } from "../vues/liste-artistes/liste-artistes.component";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [ListeArtistesComponent,IonContent],
})
export class HomePage {
  constructor() {}
}
