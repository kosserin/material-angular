import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { finalize, Subscription } from 'rxjs';
import { ChartOptions } from '../core/models/chart-options.model';

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
export class DashboardComponent implements OnInit, OnDestroy {
  role!: Role;
  user!: User;
  Role = Role;
  managerNameOfEmployee?: string;
  userProjectsNames?: string;
  reports?: Report[];
  reportEntityTypes: EntityType[] = [];
  reportsByEntityType: { [key: string]: any[] } = {};
  sub = new Subscription();
  loadingAverageTimeReports = false;
  errorAverageTimeReports = false;

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

  barOptions: ChartOptions = {};

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
    this.sub = this.reportService.reportEvent.subscribe(() => {
      if (this.role === Role.Owner) {
        this.getAllReports();
        this.getAverageTimesReports();
      }

      if (this.role === Role.Employee) {
        this.getManagerByEmployeesName();
        this.getProjectsByEmployeeUsername();
      }
    });

    this.route.data.subscribe((data) => {
      this.role = data['role'];

      if (this.role === Role.Owner) {
        this.getAllReports();
        this.getAverageTimesReports();
      }

      if (this.role === Role.Employee) {
        this.getManagerByEmployeesName();
        this.getProjectsByEmployeeUsername();
      }
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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

  getAverageTimesReports() {
    this.loadingAverageTimeReports = true;
    this.reportService
      .getAverageTimesReports()
      .pipe(finalize(() => (this.loadingAverageTimeReports = false)))
      .subscribe({
        next: (reports) => {
          const dataMap: { [key: string]: { [key: string]: number } } = {};

          // Group data by entityType and transmissionType
          reports.forEach((report) => {
            const { entityType, transmissionType, averageTime } = report;

            // Check if both entityType and transmissionType are null
            if (entityType === null && transmissionType === null) {
              if (!dataMap['WebSocket']) {
                dataMap['WebSocket'] = { WebSocket: averageTime };
              } else {
                dataMap['WebSocket']['WebSocket'] = averageTime;
              }
            } else {
              if (!dataMap[entityType]) {
                dataMap[entityType] = {};
              }
              if (transmissionType === null) {
                dataMap[entityType]['WebSocket'] = averageTime;
              } else {
                dataMap[entityType][transmissionType] = averageTime;
              }
            }
          });

          // Prepare data for chart
          const httpDataPoints: { label: string; y: number }[] = [];
          const kafkaDataPoints: { label: string; y: number }[] = [];
          const websocketDataPoints: { label: string; y: number }[] = [];

          Object.keys(dataMap).forEach((entityType) => {
            if (entityType === 'WebSocket') {
              websocketDataPoints.push({
                label: entityType,
                y: dataMap[entityType]['WebSocket'],
              });
            } else {
              httpDataPoints.push({
                label: entityType,
                y: dataMap[entityType]['HTTP'],
              });
              kafkaDataPoints.push({
                label: entityType,
                y: dataMap[entityType]['KAFKA'],
              });
              websocketDataPoints.push({
                label: entityType,
                y: dataMap[entityType]['WebSocket'] || 0,
              });
            }
          });
          this.barOptions = {
            animationEnabled: true,
            title: {
              text: 'Average Times for reports',
            },
            axisY: {
              title: 'Time (ms)',
            },
            axisX: {
              title: 'Entity types',
            },
            toolTip: {
              shared: false,
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
            data: [],
          };
          this.barOptions.data!.push({
            type: 'column',
            name: 'HTTP',
            legendText: 'HTTP',
            showInLegend: true,
            dataPoints: httpDataPoints,
          });
          this.barOptions.data!.push({
            type: 'column',
            name: 'KAFKA',
            legendText: 'KAFKA',
            showInLegend: true,
            dataPoints: kafkaDataPoints,
          });
          this.barOptions.data!.push({
            type: 'column',
            name: 'WebSocket',
            legendText: 'WebSocket',
            showInLegend: false,
            dataPoints: websocketDataPoints,
          });
        },
        error: (error) => {
          this.errorAverageTimeReports = true;
          this.snackBar.open(error, '', { duration: 2000 });
        },
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

      const webSocketDataPoints = reports
        .filter((report) => report.frontendReceivedTime !== null)
        .map((report, i) => ({
          x: i,
          y: report.frontendReceivedTime - report.receivedTime,
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
          {
            type: 'line',
            showInLegend: true,
            xValueFormatString: 'ID: ####',
            name: 'WebSocket',
            dataPoints: webSocketDataPoints,
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
