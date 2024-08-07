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

  rejectAnnualLeave(employeeUsername: string) {
    const url = `${environment.apiUrl}annual_leave_manager/${employeeUsername}`;
    return this.http.patch(url, {});
  }

  approveAnnualLeave(employeeUsername: string) {
    const url = `${environment.apiUrl}annual_leave_manager/${employeeUsername}`;
    return this.http.post(url, {});
  }

  getDaysLeft() {
    const url = `${environment.apiUrl}annual_leave_developer/daysLeft`;
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

  // Manager and employee
  getAllAnnualLeaves() {
    const url = `${environment.apiUrl}annual_leave_manager`;
    return this.http.get<AnnualLeaveByUsernameResponse[]>(url);
  }
}
