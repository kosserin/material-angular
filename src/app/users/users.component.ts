import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { finalize } from 'rxjs';
import { UserItem } from '../core/models/user-list.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../core/models/role';
import { UserService } from '../core/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { UserTitle } from '../core/models/user-title.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, AfterViewInit {
  users: UserItem[] = [];
  isLoadingUsers = false;
  error = false;
  displayedColumns: string[] = [
    'name',
    'surname',
    'role',
    'title',
    'email',
    'city',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserItem>([]);
  role!: Role;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isLoadingUsers = true;
    this.userService
      .getUsers()
      .pipe(finalize(() => (this.isLoadingUsers = false)))
      .subscribe({
        next: (users) => (this.dataSource.data = users),
        error: () => (this.error = true),
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  navigateToEditUser(username: string) {
    this.router.navigate(['edit', username], { relativeTo: this.route });
  }

  navigateToCreateUser() {
    this.router.navigate(['create'], { relativeTo: this.route });
  }

  getUserRoles(roleList: Role[]) {
    const userRoles: string[] = [];

    if (roleList.includes(Role.Owner)) {
      userRoles.push('Owner');
    }

    if (roleList.includes(Role.Manager)) {
      userRoles.push('Manager');
    }

    if (roleList.includes(Role.Employee)) {
      userRoles.push('Employee');
    }

    return userRoles.join(', ');
  }

  getUserTitles(titles: UserTitle[]) {
    const userTitles: string[] = [];

    if (titles.includes(UserTitle.Senior)) {
      userTitles.push('Senior');
    }

    if (titles.includes(UserTitle.Medior)) {
      userTitles.push('Medior');
    }

    if (titles.includes(UserTitle.Junior)) {
      userTitles.push('Junior');
    }

    return userTitles.join(', ');
  }
}
