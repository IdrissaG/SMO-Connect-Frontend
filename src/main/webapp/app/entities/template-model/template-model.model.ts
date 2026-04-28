export interface ITemplateModel {
  id: number;
  nom?: string | null;
  fichier?: string | null;
  actif?: boolean | null;
}

export type NewTemplateModel = Omit<ITemplateModel, 'id'> & { id: null };
