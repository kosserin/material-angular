import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserItem } from '../models/user-list.model';

@Injectable({
  providedIn: 'root',
})
export class UserResolver {
  constructor(private userService: UserService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<UserItem | undefined> {
    const username = route.paramMap.get('username');

    if (username) {
      return this.userService.getByUsername(username);
    }

    return of(undefined);
  }
}
