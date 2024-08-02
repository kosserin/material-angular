import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { finalize, map } from 'rxjs';
import { UserItem } from '../core/models/user-list.model';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from '../core/models/role';
import { UserService } from '../core/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { UserTitle } from '../core/models/user-title.model';
import { AuthService } from '../auth.service';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { PageRequest } from '../core/models/page-request.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    PageHeaderComponent,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, AfterViewInit {
  users: UserItem[] = [];
  error = false;
  displayedColumns: string[] = [
    'username',
    'firstname',
    'lastname',
    'authoritiesList',
    'title',
    'email',
    'city',
    'actions',
  ];
  dataSource = new MatTableDataSource<UserItem>([]);
  role!: Role;
  Role = Role;
  managerNameOfEmployee?: string;

  pageInfo: PageRequest = {
    pageNo: 1,
    pageSize: 5,
    sortBy: this.displayedColumns[0],
    sortOrder: 'asc',
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.role = data['role'];
      if (this.role === Role.Employee) {
        this.getManager();
      } else {
        this.loadUsers();
      }
    });
  }

  ngAfterViewInit() {
    if (this.role === Role.Employee) {
      return;
    }

    this.dataSource.sort = this.sort;

    this.sort.sortChange.subscribe((sort) => {
      if (sort.direction === '') {
        return;
      }

      this.pageInfo.sortBy = sort.active || this.pageInfo.sortBy;
      this.pageInfo.sortOrder = sort.direction || this.pageInfo.sortOrder;
      this.pageInfo.pageNo = 1;
      this.paginator.pageIndex = 0;
      this.loadUsers();
    });

    this.paginator.page.subscribe(() => {
      this.pageInfo.pageNo = this.paginator.pageIndex + 1;
      this.pageInfo.pageSize = this.paginator.pageSize;
      this.loadUsers();
    });
  }

  navigateToEditUser(element: UserItem) {
    this.router.navigate([element.username, 'edit'], {
      relativeTo: this.route,
    });
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

  getManager() {
    this.userService
      .getManagerByEmployeesName(this.authService.currentUserValue.username)
      .subscribe({
        next: (managerName) => {
          console.log(managerName);
          this.managerNameOfEmployee = managerName;
        },
      });
  }

  loadUsers() {
    this.userService
      .getUsers(this.pageInfo)
      .pipe(
        map((response) => {
          this.paginator.length = response.totalElements;

          if (this.role === Role.Owner) {
            return response.content;
          }

          return response.content.filter(
            (u) => !u.roleList.includes(Role.Owner)
          );
        })
      )
      .subscribe({
        next: (users: UserItem[]) => (this.dataSource.data = users),
        error: () => (this.error = true),
      });
  }
}
