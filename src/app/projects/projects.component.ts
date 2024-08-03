import { Component, OnInit } from '@angular/core';
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
import { AuthService } from '../auth.service';

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
  ],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
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
    projectWorkId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });
  removeDeveloperForm = new FormGroup({
    employeeUsername: new FormControl('', [Validators.required]),
    projectWorkId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });
  projectFromSearchedProjectWork?: ExistingProject;
  searchProjectForm = new FormGroup({
    projectWorkId: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]*$'),
    ]),
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.role = data['role'];

      if (this.role === Role.Owner) {
        this.loadAllProjects();
      }
    });
  }

  loadAllProjects() {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => (this.dataSource.data = projects),
      error: () => (this.error = true),
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
      const { projectWorkId, employeeUsername } =
        this.addDeveloperForm.getRawValue();

      if (projectWorkId !== null && employeeUsername !== null) {
        this.projectService
          .addEmployeeToProject(
            this.authService.currentUserValue.username,
            employeeUsername,
            +projectWorkId
          )
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
            error: () => {
              this.snackBar.open(
                'Something went wrong while adding employee to the project.',
                '',
                {
                  duration: 2000,
                }
              );
            },
          });
      }
    }
  }

  removeDeveloperFromProject() {
    if (this.removeDeveloperForm.valid) {
      const { projectWorkId, employeeUsername } =
        this.removeDeveloperForm.getRawValue();

      if (projectWorkId !== null && employeeUsername !== null) {
        this.projectService
          .removeEmployeeFromProject(
            this.authService.currentUserValue.username,
            employeeUsername,
            +projectWorkId
          )
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
            error: () => {
              this.snackBar.open(
                'Something went wrong while removing employee from the project.',
                '',
                {
                  duration: 2000,
                }
              );
            },
          });
      }
    }
  }
  searchForProject() {
    if (this.searchProjectForm.valid) {
      const { projectWorkId } = this.searchProjectForm.getRawValue();

      if (projectWorkId !== null) {
        this.projectService.getProjectWorkById(+projectWorkId).subscribe({
          next: (project) => {
            this.projectFromSearchedProjectWork = project;
          },
          error: () => {
            this.projectFromSearchedProjectWork = undefined;
            this.snackBar.open(
              'Something went wrong while searching for project work.',
              '',
              {
                duration: 2000,
              }
            );
          },
        });
      }
    }
  }
}
