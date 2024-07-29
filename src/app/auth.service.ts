import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';
import { User } from './core/models/user';
import { environment } from '../environments/environment';
import { Role } from './core/models/role';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public get isOwner(): boolean {
    return !!this.currentUserValue.authorities.find(
      (a) => a.authority === Role.Owner
    );
  }
  public get isManager(): boolean {
    return !!this.currentUserValue.authorities.find(
      (a) => a.authority === Role.Manager
    );
  }
  public get isEmployee(): boolean {
    return !!this.currentUserValue.authorities.find(
      (a) => a.authority === Role.Employee
    );
  }

  login(data: { username: string; password: string }): Observable<User> {
    const url = `${environment.apiUrl}auth/login`;
    const params = new URLSearchParams();
    params.set('username', data.username);
    params.set('password', data.password);
    return this.http
      .post<User>(url, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .pipe(
        tap((user) => {
          const userWToken: User = {
            ...user,
            token: 'Basic ' + btoa(`${data.username}:${data.password}`),
          };
          localStorage.setItem('currentUser', JSON.stringify(userWToken));
          this.currentUserSubject.next(userWToken);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(this.currentUserValue);
    return of({ success: false });
  }
}
