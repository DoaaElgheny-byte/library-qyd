import { Injectable } from '@angular/core';
import { WebApiService } from '../webApi.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private webApi: WebApiService) { }

  AddProject(body: any) {
    return this.webApi.post('api/app/manage-project/project-data', body);
  }
  editProject(body: any) {
    return this.webApi.put('api/app/manage-project/edit-project-data', body);
  }
}
