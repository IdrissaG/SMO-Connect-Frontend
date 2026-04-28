export interface IApplication {
  id: number;
  nom?: string | null;
}

export type NewApplication = Omit<IApplication, 'id'> & { id: null };
