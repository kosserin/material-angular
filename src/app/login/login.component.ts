import { Component, signal } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { delay, finalize } from 'rxjs';
import { Role } from '../core/models/role';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });
  hide = signal(true);
  loading = false;
  error?: string;

  constructor(private authService: AuthService, private router: Router) {}

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
    event.preventDefault()
  }

  onSubmit() {
    const { username, password } = this.loginForm.value;
    this.error = undefined;

    if (this.loginForm.valid && username && password) {
      this.loading = true;
      this.authService
        .login({ username, password })
        .pipe(
          delay(1000),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          next: (user) => {
            const isOwner = !!user.authorities.find(
              (a) => a.authority === Role.Owner
            );
            const isManager = !!user.authorities.find(
              (a) => a.authority === Role.Manager
            );
            const isEmployee = !!user.authorities.find(
              (a) => a.authority === Role.Employee
            );
            if (isOwner) {
              this.router.navigate(['/owner/dashboard']);
            }
            if (isManager) {
              this.router.navigate(['/manager/dashboard']);
            }
            if (isEmployee) {
              this.router.navigate(['/employee/dashboard']);
            }
          },
          error: () => {
            this.error = 'Something went wrong. Please try again.';
          },
        });
    }
  }
}
