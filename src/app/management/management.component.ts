import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ManagementService } from '../core/services/management.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss',
})
export class ManagementComponent implements OnInit {
  searchForm!: FormGroup;
  assignForm!: FormGroup;
  updateForm!: FormGroup;
  textToDisplayForSearchManagement = '';

  constructor(
    private fb: NonNullableFormBuilder,
    private snackBar: MatSnackBar,
    private managementService: ManagementService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      managementId: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    });
    this.assignForm = this.fb.group({
      managerUsername: ['', [Validators.required, Validators.minLength(2)]],
      employeeUsername: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.updateForm = this.fb.group({
      managerUsername: ['', [Validators.required, Validators.minLength(2)]],
      employeeUsername: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  searchForManagement() {
    if (!this.searchForm.valid) {
      return;
    }

    const managementId = this.searchForm.controls['managementId'].value;

    this.managementService.getManagementById(managementId).subscribe({
      next: (managementResponse) => {
        this.textToDisplayForSearchManagement = `Employee <b>${managementResponse.employee.username}</b> is under management of <b>${managementResponse.manager.username}</b>`;
      },
      error: () => {
        this.textToDisplayForSearchManagement = '';
        this.snackBar.open(
          'Something went wrong while searching for management.',
          '',
          {
            duration: 2000,
          }
        );
      },
    });
  }

  createManagement() {
    if (!this.assignForm.valid) {
      return;
    }

    const managerUsername = this.assignForm.controls['managerUsername'].value;
    const employeeUsername = this.assignForm.controls['employeeUsername'].value;

    this.managementService
      .createManagement(managerUsername, employeeUsername)
      .subscribe({
        next: () => {
          this.snackBar.open('You successfully created management.', '', {
            duration: 2000,
          });
        },
        error: () => {
          this.snackBar.open(
            'Something went wrong while creating management.',
            '',
            {
              duration: 2000,
            }
          );
        },
      });
  }

  updateManagement() {
    if (!this.updateForm.valid) {
      return;
    }

    const managerUsername = this.updateForm.controls['managerUsername'].value;
    const employeeUsername = this.updateForm.controls['employeeUsername'].value;

    this.managementService
      .updateManagerForEmployee(managerUsername, employeeUsername)
      .subscribe({
        next: () => {
          this.snackBar.open('You successfully created management.', '', {
            duration: 2000,
          });
        },
        error: () => {
          this.snackBar.open(
            'Something went wrong while updating management.',
            '',
            {
              duration: 2000,
            }
          );
        },
      });
  }
}
