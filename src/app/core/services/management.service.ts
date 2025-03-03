import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ManagementResponse } from '../models/management.model';

@Injectable({
  providedIn: 'root',
})
export class ManagementService {
  managementEvent = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  // owner only
  getManagements() {
    const url = `${environment.apiUrl}management`;
    return this.http.get<ManagementResponse[]>(url);
  }

  getManagementById(id: string) {
    const url = `${environment.apiUrl}management/${id}`;
    return this.http.get<ManagementResponse>(url);
  }

  updateManagerForEmployee(managerUsername: string, employeeUsername: string) {
    const url = `${environment.apiUrl}management/${managerUsername}/${employeeUsername}`;
    return this.http.patch(url, {});
  }

  createManagement(managerUsername: string, employeeUsername: string) {
    const url = `${environment.apiUrl}management/${managerUsername}/${employeeUsername}`;
    return this.http.post(url, {});
  }

  getAllManagementsForManager(managerUsername: string) {
    const url = `${environment.apiUrl}project_management/managerinfo/${managerUsername}`;
    return this.http.get<ManagementResponse[]>(url);
  }
}
