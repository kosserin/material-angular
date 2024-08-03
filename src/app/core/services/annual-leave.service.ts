import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  AnnualLeaveByUsernameResponse,
  AnnualLeaveRequest,
} from '../models/annual-leave.model';

@Injectable({
  providedIn: 'root',
})
export class AnnualLeaveService {
  constructor(private http: HttpClient) {}

  getAnnualLeaveById(id: string) {
    const url = `${environment.apiUrl}annual_leave_manager/${id}`;
    return this.http.get(url);
  }

  rejectAnnualLeave(managerUsername: string, employeeUsername: string) {
    const url = `${environment.apiUrl}annual_leave_manager/${managerUsername}/${employeeUsername}`;
    return this.http.patch(url, {});
  }

  approveAnnualLeave(managerUsername: string, employeeUsername: string) {
    const url = `${environment.apiUrl}annual_leave_manager/${managerUsername}/${employeeUsername}`;
    return this.http.post(url, {});
  }

  getDaysLeft(employeeUsername: string) {
    const url = `${environment.apiUrl}annual_leave_developer/daysLeft/${employeeUsername}`;
    return this.http.get<number>(url, { responseType: 'text' as 'json' });
  }

  getAnnualLeavesByUsername(employeeUsername: string) {
    const url = `${environment.apiUrl}annual_leave_developer/${employeeUsername}`;
    return this.http.get<AnnualLeaveByUsernameResponse[]>(url);
  }

  requestAnnualLeave(annualLeaveRequest: AnnualLeaveRequest) {
    const url = `${environment.apiUrl}annual_leave_developer/request`;
    return this.http.post<AnnualLeaveByUsernameResponse>(
      url,
      annualLeaveRequest
    );
  }

  // Menager and employee
  getAllAnnualLeaves() {
    const url = `${environment.apiUrl}annual_leave_manager`;
    return this.http.get<AnnualLeaveByUsernameResponse[]>(url);
  }
}
