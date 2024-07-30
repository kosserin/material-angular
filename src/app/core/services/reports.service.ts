import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getAllReports() {
    const url = `${environment.apiUrl}reports`;
    return this.http.get(url);
  }
}
