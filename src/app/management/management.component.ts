import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ManagementResponse } from '../core/models/management.model';
import { Role } from '../core/models/role';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-management',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
  ],
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss',
})
export class ManagementComponent implements OnInit, OnDestroy {
  searchForm!: FormGroup;
  assignForm!: FormGroup;
  updateForm!: FormGroup;
  textToDisplayForSearchManagement = '';
  displayedColumns: string[] = ['id', 'employeeUsername', 'managerUsername'];
  dataSource = new MatTableDataSource<ManagementResponse>([]);
  error = false;
  role!: Role;
  Role = Role;
  sub = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private fb: NonNullableFormBuilder,
    private snackBar: MatSnackBar,
    private managementService: ManagementService
  ) {}

  ngOnInit(): void {
    this.sub = this.managementService.managementEvent.subscribe(() => {
      console.log('entered');
      
      if (this.role === Role.Owner) {
        this.getManagements();
      }
    });

    this.route.data.subscribe((data) => {
      this.role = data['role'];
      if (this.role === Role.Owner) {
        this.getManagements();
      }
    });

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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  getManagements() {
    this.managementService.getManagements().subscribe({
      next: (managements) => (this.dataSource.data = managements),
      error: (error) => {
        this.error = true;
        this.snackBar.open(error, '', {
          duration: 2000,
        });
      },
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
      error: (error) => {
        this.textToDisplayForSearchManagement = '';
        this.snackBar.open(error, '', {
          duration: 2000,
        });
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
        error: (error) =>
          this.snackBar.open(error, '', {
            duration: 2000,
          }),
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
          this.snackBar.open('You successfully updated management.', '', {
            duration: 2000,
          });
        },
        error: (error) =>
          this.snackBar.open(error, '', {
            duration: 2000,
          }),
      });
  }
}
