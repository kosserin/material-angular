export interface ManagementResponse {
  id: number;
  manager: ManagementUserResponse;
  employee: ManagementUserResponse;
}

interface ManagementUserResponse {
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
