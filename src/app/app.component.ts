import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReportService } from './core/services/report.service';
import { UserService } from './core/services/user.service';
import { AnnualLeaveService } from './core/services/annual-leave.service';
import { ProjectService } from './core/services/project.service';
import { ManagementService } from './core/services/management.service';
import { StompService } from './core/services/stomp.service';
import { NotificationResponse } from './core/models/notification-response.model';
import { EntityType } from './core/models/entity-type.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private reportService: ReportService,
    private userService: UserService,
    private annualLeaveService: AnnualLeaveService,
    private projectService: ProjectService,
    private managementService: ManagementService,
    private stompService: StompService
  ) {}

  ngOnInit(): void {
    this.stompService.subscribe(
      '/topic/notifications',
      (message: NotificationResponse) => {
        if (message.entityType === EntityType.User) {
          this.userService.userEvent.emit();
          this.reportService.reportEvent.emit();
        }

        if (message.entityType === EntityType.AnnualLeave) {
          this.annualLeaveService.annulaLeaveEvent.emit();
          this.reportService.reportEvent.emit();
        }

        if (message.entityType === EntityType.Project) {
          this.projectService.projectEvent.emit();
          this.reportService.reportEvent.emit();
        }

        if (message.entityType === EntityType.Management) {
          this.managementService.managementEvent.emit();
          this.reportService.reportEvent.emit();
        }
      }
    );
  }
}
