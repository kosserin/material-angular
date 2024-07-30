export interface ExistingProject {
  project_id: number;
  name: string;
  budget: number;
  finishDay: string;
}

export interface NewProject {
  name: string;
  budget: number;
  finishDay: string;
}
