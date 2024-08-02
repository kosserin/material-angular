import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserItem } from '../models/user-list.model';
import { ProjectService } from '../services/project.service';
import { ExistingProject } from '../models/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectResolver {
  constructor(private projectService: ProjectService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ExistingProject | undefined> {
    const projectId = route.paramMap.get('projectId');

    if (projectId) {
      return this.projectService.getProjectById(+projectId);
    }

    return of(undefined);
  }
}
