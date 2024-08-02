import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Role } from '../core/models/role';
import { User } from '../core/models/user';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [MatIcon, MatButtonModule, RouterModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
})
export class PageHeaderComponent {
  role!: Role;
  user!: User;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.role = data['role'];
    });

    this.user = this.authService.currentUserValue;
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/login']);
      }
    });
  }

  canSeeManagement(): boolean {
    return !!this.user.authorities.find((a) => a.authority === Role.Owner);
  }

  navigateToDashboard() {
    const role = this.authService.isOwner
      ? 'owner'
      : this.authService.isManager
      ? 'manager'
      : 'employee';
    this.router.navigate([role, 'dashboard']);
  }

  navigateToUsers() {
    const role = this.authService.isOwner
      ? 'owner'
      : this.authService.isManager
      ? 'manager'
      : 'employee';
    this.router.navigate([role, 'users']);
  }

  navigateToAnnualLeave() {
    const role = this.authService.isOwner
      ? 'owner'
      : this.authService.isManager
      ? 'manager'
      : 'employee';
    this.router.navigate([role, 'annual-leave']);
  }

  navigateToProjects() {
    const role = this.authService.isOwner
      ? 'owner'
      : this.authService.isManager
      ? 'manager'
      : 'employee';
    this.router.navigate([role, 'projects']);
  }

  navigateToManagement() {
    const role = this.authService.isOwner
      ? 'owner'
      : this.authService.isManager
      ? 'manager'
      : 'employee';
    this.router.navigate([role, 'management']);
  }
}
