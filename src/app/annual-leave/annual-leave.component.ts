import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { Role } from '../core/models/role';
import { AnnualLeaveService } from '../core/services/annual-leave.service';
import { AuthService } from '../auth.service';
import { User } from '../core/models/user';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  AnnualLeaveByUsernameResponse,
  AnnualLeaveRequest,
} from '../core/models/annual-leave.model';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { finalize } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import moment, { duration } from 'moment';

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'YYYY-MM-DD', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-annual-leave',
  standalone: true,
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatDatepickerModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT },
  ],
  templateUrl: './annual-leave.component.html',
  styleUrl: './annual-leave.component.scss',
})
export class AnnualLeaveComponent implements OnInit {
  role!: Role;
  Role = Role;
  user!: User;
  yourDisplayedColumns: string[] = ['id', 'start', 'end', 'confirmed'];
  toApproveDisplayedColumns: string[] = [
    'id',
    'username',
    'start',
    'end',
    'actions',
  ];
  yourDataSource = new MatTableDataSource<AnnualLeaveByUsernameResponse>([]);
  toApproveDataSource = new MatTableDataSource<AnnualLeaveByUsernameResponse>(
    []
  );
  error = false;
  isLoadingAnnualLeaves = false;
  requestAnnualLeaveForm = new FormGroup({
    start: new FormControl(moment(), [Validators.required]),
    end: new FormControl(moment().add(7, 'days'), [Validators.required]),
  });
  daysLeftOfAnnualLeave?: number;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private annualLeaveService: AnnualLeaveService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;

    this.route.data.subscribe((data) => {
      this.role = data['role'];

      if (this.role !== Role.Owner) {
        this.getAnnualLeavesByUsername();
        this.getDaysLeft();
      }

      if (this.role !== Role.Employee) {
        this.getAllAnnualLeaves();
      }
    });
  }

  getDate7DaysInFuture(): Date {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Add 7 days to the current date
    return today;
  }

  getAnnualLeavesByUsername() {
    this.isLoadingAnnualLeaves = true;
    this.annualLeaveService
      .getAnnualLeavesByUsername(this.user.username)
      .pipe(finalize(() => (this.isLoadingAnnualLeaves = false)))
      .subscribe({
        next: (annualLeaves) => {
          this.yourDataSource.data = annualLeaves;
          console.log(annualLeaves);
        },
        error: (error) => {
          this.error = true;
          this.snackBar.open(error, '', { duration: 2000 });
        },
      });
  }

  requestAnnualLeave() {
    if (this.requestAnnualLeaveForm.valid) {
      const request: AnnualLeaveRequest = {
        start: this.requestAnnualLeaveForm
          .getRawValue()
          .start!.format('YYYY-MM-DD'),
        end: this.requestAnnualLeaveForm
          .getRawValue()
          .end!.format('YYYY-MM-DD'),
      };

      this.annualLeaveService.requestAnnualLeave(request).subscribe({
        next: () => {
          this.snackBar.open('Your annual leave request has been sent.', '', {
            duration: 2000,
          });

          this.getDaysLeft();
          this.getAnnualLeavesByUsername();
        },
        error: (error) => this.snackBar.open(error, '', { duration: 2000 }),
      });
    }
  }

  getDaysLeft() {
    this.annualLeaveService.getDaysLeft().subscribe({
      next: (daysLeft) => {
        this.daysLeftOfAnnualLeave = daysLeft;
      },
      error: (error) => {
        this.daysLeftOfAnnualLeave = undefined;
        this.snackBar.open(error, '', { duration: 2000 });
      },
    });
  }

  getAllAnnualLeaves() {
    this.annualLeaveService.getAllAnnualLeaves().subscribe({
      next: (annualLeaves) => {
        this.toApproveDataSource.data = annualLeaves;
      },
      error: (error) => {
        this.toApproveDataSource.data = [];
        this.snackBar.open(error, '', { duration: 2000 });
      },
    });
  }

  approveAnnualLeave(employeeUsername: string) {
    this.annualLeaveService.approveAnnualLeave(employeeUsername).subscribe({
      next: () => this.getAllAnnualLeaves(),
      error: (error) => {
        this.snackBar.open(error, '', { duration: 2000 });
      },
    });
  }

  rejectAnnualLeave(employeeUsername: string) {
    this.annualLeaveService.rejectAnnualLeave(employeeUsername).subscribe({
      next: () => this.getAllAnnualLeaves(),
      error: (error) => {
        this.snackBar.open(error, '', { duration: 2000 });
      },
    });
  }
}
