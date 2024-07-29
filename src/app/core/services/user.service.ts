import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UserItem } from '../models/user-list.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    const url = `${environment.apiUrl}users`;
    return this.http.get<UserItem[]>(url);
  }

  createUser(formData: UserItem) {
    const url = `${environment.apiUrl}users`;
    return this.http.post<UserItem>(url, formData);
  }
}
