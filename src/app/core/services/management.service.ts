import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  constructor(private http: HttpClient) {}

  getManagementById(id: string) {
    const url = `${environment.apiUrl}management/${id}`;
    return this.http.get(url);
  }

  updateManagerForEmployee(managerUsername: string, employeeUsername: string) {
    const url = `${environment.apiUrl}management/${managerUsername}/${employeeUsername}`;
    return this.http.patch(url, {});
  }

  createManagement(managerUsername: string, employeeUsername: string) {
    const url = `${environment.apiUrl}management/${managerUsername}/${employeeUsername}`;
    return this.http.post(url, {});
  }
}
