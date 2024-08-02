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

export interface GetProjectWorkResponse {
  project_work_id: number;
  users: ProjectAndManagementUserResponse[];
  project: ExistingProject;
}

export interface ProjectAndManagementUserResponse {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
  email: string;
  city: {
    postalcode: number;
    name: string;
  };
  title: string;
  authoritiesList: [
    {
      authority: string;
    }
  ];
}
