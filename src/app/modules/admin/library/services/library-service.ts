import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { WebApiService } from 'src/app/services/webApi.service';
import { ResponseEnvelope } from '../models/response-envelope.model';
import {
  CreateFolderFileResponse,
  ListRequest,
  ListResponse,
} from '../models/list-content.model';
import {
  CreateFileRequest,
  CreateFolderRequest,
  DownloadDeleteFileOrFolderRequest,
} from '../models/create-folder.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  constructor(private webApi: WebApiService) {}

  listContent(body: ListRequest): Observable<ResponseEnvelope<ListResponse>> {
    return this.webApi.post('api/app/manage-library/ListContent', body);
  }

  createFolder(
    body: CreateFolderRequest
  ): Observable<ResponseEnvelope<CreateFolderFileResponse>> {
    return this.webApi.post('api/app/manage-library/CreateFolder', body);
  }

  uploadFile(body: CreateFileRequest) {
    return this.webApi.post('api/app/manage-library/UploadFile', body);
  }

  downloadFile(body: DownloadDeleteFileOrFolderRequest) {
    return fetch(`${environment.api_url}api/app/manage-library/DownloadFile`, {
      method: 'POST',
      headers: {
        Authorization: `${localStorage.getItem('access_token_quid')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((response) => response.blob())
      .then((blob) => URL.createObjectURL(blob));
  }

  deleteFolder(body: DownloadDeleteFileOrFolderRequest) {
    return this.webApi.post('api/app/manage-library/DeleteFolder', body);
  }

  deleteFile(body: DownloadDeleteFileOrFolderRequest) {
    return this.webApi.post('api/app/manage-library/DeleteFile', body);
  }

  update() {}
  delete() {}
}
