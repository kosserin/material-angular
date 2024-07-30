import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ExistingProject, NewProject } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private http: HttpClient) {}

  getAllProjects() {
    const url = `${environment.apiUrl}projects_owner`;
    return this.http.get<ExistingProject[]>(url);
  }

  createProject(project: NewProject) {
    const url = `${environment.apiUrl}projects_owner`;
    return this.http.post(url, project);
  }

  getProjectById(id: number) {
    const url = `${environment.apiUrl}projects_owner/${id}`;
    return this.http.get(url);
  }

  updateProject(project: ExistingProject) {
    const url = `${environment.apiUrl}projects_owner`;
    return this.http.patch(url, project);
  }

  deleteProject(id: number) {
    const url = `${environment.apiUrl}projects_owner/${id}`;
    return this.http.delete(url);
  }

  addEmployeeToProject(
    managerUsername: string,
    employeeUsername: string,
    projectId: number
  ) {
    const url = `${environment.apiUrl}projects_owner/${managerUsername}/${employeeUsername}/${projectId}`;
    return this.http.patch(url);
  }

  removeEmployeeFromProject(
    managerUsername: string,
    employeeUsername: string,
    projectId: number
  ) {
    const url = `${environment.apiUrl}projects_owner/${managerUsername}/${employeeUsername}/${projectId}`;
    return this.http.delete(url);
  }

  getProjectByEmployeeUsername(employeeUsername: string) {
    const url = `${environment.apiUrl}projects_owner/${employeeUsername}`;
    return this.http.get(url);
  }

  getProjectWorkById(id: number) {
    const url = `${environment.apiUrl}projects_owner/${id}`;
    return this.http.get(url);
  }
}
