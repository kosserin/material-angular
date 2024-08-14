import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../core/models/role';
import { ProjectService } from '../core/services/project.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ExistingProject } from '../core/models/project.model';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { DeleteProjectDialogComponent } from '../delete-project-dialog/delete-project-dialog.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagementService } from '../core/services/management.service';
import { AuthService } from '../auth.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit, OnDestroy {
  error = false;
  displayedColumns: string[] = [
    'project_id',
    'name',
    'budget',
    'finishDay',
    'actions',
  ];
  dataSource = new MatTableDataSource<ExistingProject>([]);
  role!: Role;
  Role = Role;
  addDeveloperForm = new FormGroup({
    employeeUsername: new FormControl('', [Validators.required]),
    projectId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });
  removeDeveloperForm = new FormGroup({
    employeeUsername: new FormControl('', [Validators.required]),
    projectId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });
  projectFromSearchedProjectWork?: ExistingProject;
  searchProjectForm = new FormGroup({
    projectId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });
  managedEmployeeUsernames: string[] = [];
  sub = new Subscription();

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private authService: AuthService,
    private projectService: ProjectService,
    private managementService: ManagementService
  ) {}

  ngOnInit(): void {
    this.sub = this.projectService.projectEvent.subscribe(() => {
      if (this.role === Role.Owner) {
        this.loadAllProjects();
      }

      if (this.role !== Role.Employee) {
        this.getAllManagementsForManager();
      }
    });

    this.route.data.subscribe((data) => {
      this.role = data['role'];

      if (this.role === Role.Owner) {
        this.loadAllProjects();
      }

      if (this.role !== Role.Employee) {
        this.getAllManagementsForManager();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => (this.dataSource.data = projects),
      error: () => (this.error = true),
    });
  }

  getAllManagementsForManager() {
    this.managementService
      .getAllManagementsForManager(this.authService.currentUserValue.username)
      .subscribe({
        next: (managements) => {
          const employeeUsernames = managements.map((m) => m.employee.username);
          this.managedEmployeeUsernames = employeeUsernames;
        },
        error: () => (this.managedEmployeeUsernames = []),
      });
  }

  navigateToCreateProject() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  navigateToEditProject(element: ExistingProject) {
    this.router.navigate([element.project_id, 'edit'], {
      relativeTo: this.route,
    });
  }

  openDeleteProjectDialog(projectId: number) {
    this.dialog.open(DeleteProjectDialogComponent, {
      width: '300px',
      data: {
        projectId,
      },
    });
  }

  addDeveloperToProject() {
    if (this.addDeveloperForm.valid) {
      const { projectId, employeeUsername } =
        this.addDeveloperForm.getRawValue();

      if (projectId !== null && employeeUsername !== null) {
        this.projectService
          .addEmployeeToProject(employeeUsername, +projectId)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Employee is successfully added to the project.',
                '',
                {
                  duration: 2000,
                }
              );
            },
            error: (error) =>
              this.snackBar.open(error, '', {
                duration: 2000,
              }),
          });
      }
    }
  }

  removeDeveloperFromProject() {
    if (this.removeDeveloperForm.valid) {
      const { projectId, employeeUsername } =
        this.removeDeveloperForm.getRawValue();

      if (projectId !== null && employeeUsername !== null) {
        this.projectService
          .removeEmployeeFromProject(employeeUsername, +projectId)
          .subscribe({
            next: () => {
              this.snackBar.open(
                'Employee is successfully removed from the project.',
                '',
                {
                  duration: 2000,
                }
              );
            },
            error: (error) =>
              this.snackBar.open(error, '', {
                duration: 2000,
              }),
          });
      }
    }
  }
  searchForProject() {
    if (this.searchProjectForm.valid) {
      const { projectId } = this.searchProjectForm.getRawValue();

      if (projectId !== null) {
        this.projectService.getProjectWorkById(+projectId).subscribe({
          next: (project) => {
            this.projectFromSearchedProjectWork = project;
          },
          error: (error) => {
            this.projectFromSearchedProjectWork = undefined;
            this.snackBar.open(error, '', {
              duration: 2000,
            });
          },
        });
      }
    }
  }
}
