import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserItem } from '../models/user-list.model';
import { Role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    const url = `${environment.apiUrl}users`;
    return this.http.get<UserItem[]>(url);
  }

  getByUsername(username: string) {
    const url = `${environment.apiUrl}users/${username}`;
    return this.http.get<UserItem>(url);
  }

  createUser(formData: UserItem, role: Role) {
    let url = '';
    if (role === Role.Manager) {
      url = `${environment.apiUrl}users`;
    }

    if (role === Role.Owner) {
      url = `${environment.apiUrl}owner`;
    }

    return this.http.post<UserItem>(url, formData);
  }

  updateUser(formData: UserItem, role: Role) {
    let url = '';
    if (role === Role.Manager) {
      url = `${environment.apiUrl}users`;
    }

    if (role === Role.Owner) {
      url = `${environment.apiUrl}owner/${formData.username}`;
    }

    return this.http.patch<UserItem>(url, formData);
  }

  getManagerByEmployeesName(employeeUsername: string) {
    const url = `${environment.apiUrl}manager/${employeeUsername}`;

    return this.http.get(url);
  }
}
