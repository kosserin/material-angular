import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  constructor(private http: HttpClient) {}

  getAllCities() {
    const url = `${environment.apiUrl}cities`;
    return this.http.get(url);
  }
}
