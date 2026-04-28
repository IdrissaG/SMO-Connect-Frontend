export interface IPrestataire {
  id: number;
  nom?: string | null;
}

export type NewPrestataire = Omit<IPrestataire, 'id'> & { id: null };
