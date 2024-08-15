import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AverageTimeReport, Report } from '../models/report.model';
import { NotificationRequest } from '../models/notification-response.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  reportEvent = new EventEmitter<void>();

  constructor(private http: HttpClient) {}

  getAllReports() {
    const url = `${environment.reportUrl}reports`;
    return this.http.get<Report[]>(url);
  }

  getAverageTimesReports() {
    const url = `${environment.reportUrl}reports/averagetimes`;
    return this.http.get<AverageTimeReport[]>(url);
  }

  sendFrontendResponseTime(request: NotificationRequest) {
    const url = `${environment.reportUrl}reports`;
    return this.http.patch(url, request);
  }
}
