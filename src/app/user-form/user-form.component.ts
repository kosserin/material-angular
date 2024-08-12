import { Component, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';
import { Mode } from '../core/models/mode.model';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../core/services/user.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { UserTitle } from '../core/models/user-title.model';
import { MatSelectModule } from '@angular/material/select';
import { Role } from '../core/models/role';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserItem } from '../core/models/user-list.model';

@Component({
  selector: 'app-user-form',
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
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnInit {
  role!: Role;
  mode!: Mode;
  userForm!: FormGroup;
  hide = signal(true);
  loading = false;
  error?: string;
  titles = [
    {
      text: 'Junior',
      value: UserTitle.Junior,
    },
    {
      text: 'Medior',
      value: UserTitle.Medior,
    },
    {
      text: 'Senior',
      value: UserTitle.Senior,
    },
  ];
  roles = [
    {
      text: 'Employee',
      value: Role.Employee,
    },
    {
      text: 'Manager',
      value: Role.Manager,
    },
    {
      text: 'Owner',
      value: Role.Owner,
    },
  ];
  Mode = Mode;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location,
    private snackBar: MatSnackBar,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = data['mode'];
      this.role = data['role'];
      const user: UserItem | undefined = data['user'];
      this.userForm = this.fb.group({
        firstname: new FormControl(user?.firstname ?? '', [
          Validators.required,
        ]),
        lastname: new FormControl(user?.lastname ?? '', [Validators.required]),
        username: new FormControl(user?.username ?? '', [Validators.required]),
        password: new FormControl(user?.password ?? '', [
          Validators.required,
          Validators.minLength(8),
        ]),
        email: new FormControl(user?.email ?? '', [
          Validators.required,
          Validators.email,
        ]),
        title: new FormControl(user?.title ?? UserTitle.Junior, [
          Validators.required,
        ]),
        roleList: new FormControl(user?.roleList ?? [], [Validators.required]),
        city: new FormGroup({
          name: new FormControl(user?.city.name ?? '', [Validators.required]),
          postalcode: new FormControl(user?.city.postalcode ?? '', [
            Validators.required,
          ]),
        }),
      });

      this.userForm.controls['roleList'].setValue([Role.Employee]);
      this.userForm.controls['roleList'].disable();
    });
  }

  get title(): string {
    if (this.mode === Mode.Edit) {
      return 'Edit this user';
    }

    return 'Add new user';
  }

  get text(): string {
    if (this.mode === Mode.Edit) {
      return 'Update the details for the selected user. Make sure to review and save changes to keep the user information current.';
    }

    return 'Fill out the details below to create a new user account. Ensure all required fields are completed for a successful addition.';
  }

  get buttonText(): string {
    if (this.mode === Mode.Edit) {
      return 'Apply changes';
    }

    return 'Add';
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
    event.preventDefault();
  }

  onSubmit() {
    if (this.userForm.valid) {
      const {
        username,
        password,
        firstname,
        lastname,
        email,
        city,
        roleList,
        title,
      } = this.userForm.getRawValue();
      if (
        username &&
        password &&
        firstname &&
        lastname &&
        email &&
        city.name &&
        city.postalcode &&
        roleList &&
        title
      ) {
        const formData = {
          username,
          password,
          firstname,
          lastname,
          email,
          city: {
            name: city.name,
            postalcode: +city.postalcode,
          },
          roleList,
          title,
        };

        if (this.mode === Mode.Insert) {
          this.userService.createUser(formData, this.role).subscribe({
            next: () => {
              this.snackBar.open('You successfully added new user.', '', {
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
          this.userService.updateUser(formData, this.role).subscribe({
            next: () => {
              this.snackBar.open('You successfully updated user.', '', {
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
  }

  navigateBack(e: Event) {
    e.preventDefault();
    this.location.back();
  }
}
