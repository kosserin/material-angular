import { HttpClient, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserItem } from '../models/user-list.model';
import { Role } from '../models/role';
import { PageRequest } from '../models/page-request.model';
import { PageResponse } from '../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userEvent = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  getUsers(pageRequest: PageRequest) {
    const params = new HttpParams()
      .set('pageNo', pageRequest.pageNo - 1)
      .set('pageSize', pageRequest.pageSize)
      .set('sortBy', pageRequest.sortBy)
      .set('sortOrder', pageRequest.sortOrder);

    const url = `${environment.apiUrl}users/filter`;
    return this.http.get<PageResponse<UserItem>>(url, { params });
  }

  getByUsername(username: string) {
    const url = `${environment.apiUrl}users/${username}`;
    return this.http.get<UserItem>(url);
  }

  createUser(formData: UserItem, role: Role) {
    const url = `${environment.apiUrl}users`;

    return this.http.post<UserItem>(url, formData);
  }

  updateUser(formData: UserItem, role: Role) {
    const url = `${environment.apiUrl}users`;

    return this.http.patch<UserItem>(url, formData);
  }

  getManagerByEmployeesName(employeeUsername: string) {
    const url = `${environment.apiUrl}developer/manager/${employeeUsername}`;

    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }
}
