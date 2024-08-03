import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Report } from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getAllReports() {
    const url = `${environment.reportUrl}reports`;
    return this.http.get<Report[]>(url);
  }
}
