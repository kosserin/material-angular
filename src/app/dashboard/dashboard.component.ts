import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth.service';
import { Role } from '../core/models/role';
import { User } from '../core/models/user';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { UserService } from '../core/services/user.service';
import { ProjectService } from '../core/services/project.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportService } from '../core/services/report.service';
import { Report } from '../core/models/report.model';
import {
  CanvasJS,
  CanvasJSAngularChartsModule,
} from '@canvasjs/angular-charts';
import { EntityType } from '../core/models/entity-type.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatIcon,
    MatButtonModule,
    RouterModule,
    PageHeaderComponent,
    CanvasJSAngularChartsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  role!: Role;
  user!: User;
  Role = Role;
  managerNameOfEmployee?: string;
  userProjectsNames?: string;
  reports?: Report[];
  reportEntityTypes: EntityType[] = [];
  reportsByEntityType: { [key: string]: any[] } = {};

  chartOptions = {
    animationEnabled: true,
    theme: 'light2',
    title: {
      text: 'HTTP',
    },
    axisX: {
      minimum: 0,
    },
    axisY: {
      title: 'Time (ms)',
    },
    toolTip: {
      shared: true,
    },
    legend: {
      cursor: 'pointer',
      itemclick: function (e: any) {
        if (
          typeof e.dataSeries.visible === 'undefined' ||
          e.dataSeries.visible
        ) {
          e.dataSeries.visible = false;
        } else {
          e.dataSeries.visible = true;
        }
        e.chart.render();
      },
    },
    data: [
      {
        type: 'line',
        showInLegend: true,
        name: 'HTTP',
        xValueFormatString: 'ID: ####',
        dataPoints: [
          {
            x: 1,
            y: 2,
          },
        ],
      },
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;

    this.route.data.subscribe((data) => {
      this.role = data['role'];

      if (this.role === Role.Owner) {
        this.getAllReports();
      }

      if (this.role === Role.Employee) {
        this.getManagerByEmployeesName();
        this.getProjectsByEmployeeUsername();
      }
    });
  }

  getAllReports() {
    this.reportService.getAllReports().subscribe({
      next: (reports) => {
        const entityTypes = reports.map((report) => report.entityType);
        const uniqueEntityTypes = [...new Set(entityTypes)];
        this.reportEntityTypes = uniqueEntityTypes;

        // Organize reports by entity type
        this.reportEntityTypes.forEach((entityType) => {
          this.reportsByEntityType[entityType] = reports.filter(
            (report) => report.entityType === entityType
          );
        });

        this.renderCharts();
      },
      error: (error) => this.snackBar.open(error, '', { duration: 2000 }),
    });
  }

  renderCharts() {
    // For each entity type, create charts for HTTP and KAFKA
    this.reportEntityTypes.forEach((entityType) => {
      const reports = this.reportsByEntityType[entityType];

      // Filter and prepare data points for HTTP and KAFKA
      const httpDataPoints = reports
        .filter((report) => report.transmissionType === 'HTTP')
        .map((report, i) => ({
          x: i,
          y: report.receivedTime - report.sendTime,
        }));

      const kafkaDataPoints = reports
        .filter((report) => report.transmissionType === 'KAFKA')
        .map((report, i) => ({
          x: i,
          y: report.receivedTime - report.sendTime,
        }));

      const dataOptions = {
        ...this.chartOptions,
        title: { text: `Transmission Times for ${entityType}` },
        data: [
          {
            type: 'line',
            showInLegend: true,
            xValueFormatString: 'ID: ####',
            name: 'HTTP',
            dataPoints: httpDataPoints,
          },
          {
            type: 'line',
            showInLegend: true,
            xValueFormatString: 'ID: ####',
            name: 'KAFKA',
            dataPoints: kafkaDataPoints,
          },
        ],
      };

      // Render the charts
      this.createChart(`chart_${entityType}`, dataOptions);
    });
  }

  createChart(containerId: string, options: any) {
    const container = document.createElement('div');
    container.id = containerId;
    container.style.height = '370px';
    container.style.width = '100%';

    document.getElementById('chartsArea')?.appendChild(container);

    const chart = new CanvasJS.Chart(containerId, options);
    chart.render();
  }

  logout() {
    this.authService.logout().subscribe((res) => {
      if (!res.success) {
        this.router.navigate(['/login']);
      }
    });
  }

  getManagerByEmployeesName() {
    this.userService.getManagerByEmployeesName(this.user.username).subscribe({
      next: (managerName) => (this.managerNameOfEmployee = managerName),
      error: (error) => {
        this.snackBar.open(error, '', { duration: 2000 });
      },
    });
  }

  getProjectsByEmployeeUsername() {
    this.projectService
      .getProjectsByEmployeeUsername(this.user.username)
      .subscribe({
        next: (projects) => {
          const tmp = projects.map((project) => project.name);
          const onlyProjectsNames = tmp.join(', ');

          this.userProjectsNames = onlyProjectsNames;
        },
        error: (error) => this.snackBar.open(error, '', { duration: 2000 }),
      });
  }
}
