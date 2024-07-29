import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { User } from '../core/models/user';
import { AuthService } from '../auth.service';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-page404',
  standalone: true,
  imports: [RouterModule, MatButtonModule, PageHeaderComponent],
  templateUrl: './page404.component.html',
  styleUrl: './page404.component.scss',
})
export class Page404Component implements OnInit {
  user!: User;

  constructor(private authService: AuthService, private location: Location) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  goBack() {
    this.location.back();
  }
}
