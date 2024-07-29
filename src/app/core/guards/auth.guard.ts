import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(route);

    if (this.authService.currentUserValue.authorities) {
      const userRoles = this.authService.currentUserValue.authorities;
      if (userRoles.some((a) => a.authority === route.data['role'])) {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
