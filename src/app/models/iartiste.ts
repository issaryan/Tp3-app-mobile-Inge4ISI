export interface IArtiste {
  isFollowing?: boolean;
  average_note?: number;
    id?: number;
  image: string;
  nom: string;
  nom_de_scene: string;
  nombre_albums: number;
  label?: string;
  maison_edition?: string;
  date_debut: Date;
}
