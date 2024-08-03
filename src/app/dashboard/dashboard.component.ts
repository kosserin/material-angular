import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Role } from '../core/models/role';
import { User } from '../core/models/user';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { UserService } from '../core/services/user.service';
import { ProjectService } from '../core/services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExistingProject } from '../core/models/project.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIcon, MatButtonModule, RouterModule, PageHeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  role!: Role;
  user!: User;
  Role = Role;
  managerNameOfEmployee?: string;
  userProjectsNames?: string;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.route.data.subscribe((data) => {
      this.role = data['role'];

      if (this.role === Role.Employee) {
        this.getManagerByEmployeesName();
        this.getProjectsByEmployeeUsername();
      }
    });
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/login']);
      }
    });
  }

  getManagerByEmployeesName() {
    this.userService.getManagerByEmployeesName(this.user.username).subscribe({
      next: (managerName) => (this.managerNameOfEmployee = managerName),
      error: (error) => {
        let errMessage = 'Something went wrong.';
        if (error.details) {
          errMessage = `${error.status} ${error.title} - ${error.details}`;
        }
        this.snackBar.open(errMessage, '', { duration: 2000 });
      },
    });
  }

  getProjectsByEmployeeUsername() {
    this.projectService
      .getProjectsByEmployeeUsername(this.user.username)
      .subscribe({
        next: (projects) => {
          console.log(projects);

          const tmp = projects.map((project) => project.name);
          const onlyProjectsNames = tmp.join(', ');

          this.userProjectsNames = onlyProjectsNames;
        },
        error: (error) => {
          let errMessage = 'Something went wrong.';
          if (error.details) {
            errMessage = `${error.status} ${error.title} - ${error.details}`;
          }
          this.snackBar.open(errMessage, '', { duration: 2000 });
        },
      });
  }
}
