import { Component, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { ActivatedRoute } from '@angular/router';
import { Mode } from '../core/models/mode.model';
import {
  FormControl,
  FormGroup,
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
  mode!: Mode;
  userForm = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    title: new FormControl(UserTitle.Junior, [Validators.required]),
    roleList: new FormControl([], [Validators.required]),
    city: new FormGroup({
      name: new FormControl('', [Validators.required]),
      postalcode: new FormControl('', [Validators.required]),
    }),
  });
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

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.mode = data['mode'];
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
    console.log(this.userForm.value);

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
        this.userService.createUser(formData).subscribe();
      }
    }
  }

  navigateBack() {
    this.location.back();
  }
}
