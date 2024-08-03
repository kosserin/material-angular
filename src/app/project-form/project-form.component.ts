import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Mode } from '../core/models/mode.model';
import { Role } from '../core/models/role';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';
import { ExistingProject, NewProject } from '../core/models/project.model';
import { ProjectService } from '../core/services/project.service';
import { Location } from '@angular/common';
import { futureDateValidator } from '../core/validators/future-date.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './project-form.component.html',
  styleUrl: './project-form.component.scss',
})
export class ProjectFormComponent implements OnInit {
  role!: Role;
  mode!: Mode;
  projectForm!: FormGroup;
  loading = false;
  error?: string;
  Mode = Mode;
  project?: ExistingProject;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private fb: NonNullableFormBuilder,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = data['mode'];
      this.role = data['role'];
      this.project = data['project'];
      this.projectForm = this.fb.group({
        name: new FormControl(this.project?.name ?? '', [Validators.required]),
        budget: new FormControl(this.project?.budget ?? '', [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.min(1),
        ]),
        finishDay: new FormControl(this.project?.finishDay ?? '', [
          Validators.required,
          futureDateValidator(),
        ]),
      });
    });
  }

  get title(): string {
    if (this.mode === Mode.Edit) {
      return 'Edit project';
    }

    return 'Add project';
  }

  get text(): string {
    if (this.mode === Mode.Edit) {
      return "Update the details for the selected project. Review all fields and make any necessary changes to ensure project information is accurate and up-to-date. Don't forget to save your changes.";
    }

    return 'Fill out the details below to create a new project. Complete all required fields to successfully add the project to your system.';
  }

  get buttonText(): string {
    if (this.mode === Mode.Edit) {
      return 'Apply changes';
    }

    return 'Add';
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const { budget, finishDay, name } = this.projectForm.getRawValue();
      const project: NewProject = { budget, finishDay, name };
      if (this.mode === Mode.Insert) {
        this.projectService.createProject(project).subscribe({
          next: () => {
            this.snackBar.open('You successfully added new project.', '', {
              duration: 2000,
            });
            setTimeout(() => {
              this.location.back();
            }, 2000);
          },
          error: (error) =>
            this.snackBar.open(error, '', {
              duration: 2000,
            }),
        });
      }

      if (this.mode === Mode.Edit) {
        this.projectService
          .updateProject({ ...project, project_id: this.project!.project_id })
          .subscribe({
            next: () => {
              this.snackBar.open('You successfully updated project.', '', {
                duration: 2000,
              });
              setTimeout(() => {
                this.location.back();
              }, 2000);
            },
            error: (error) =>
              this.snackBar.open(error, '', {
                duration: 2000,
              }),
          });
      }
    }
  }

  navigateBack(e: Event) {
    e.preventDefault();
    this.location.back();
  }
}
