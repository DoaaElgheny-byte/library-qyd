import { Injectable, Inject } from '@angular/core';
import { WebApiService } from '../webApi.service';
@Injectable({
  providedIn: 'root',
})
export class UploadFileService {
  constructor(private webApi: WebApiService) { }

  prepareImageAsBinary(file: any) {
    let data = file;
    data = data.replace('data:image/gif;base64,', '');
    data = data.replace('data:application/pdf;base64,', '');
    data = data.replace('data:image/jpeg;base64,', '');
    data = data.replace('data:image/jpg;base64,', '');
    data = data.replace('data:image/png;base64,', '');
    data = data.replace('data:application/octet-stream;base64,', '');
    data = data.replace('data:application/xml;base64,', '');
    data = data.replace('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,', '');
    data = data.replace('data:image/svg+xml;base64,', '');
    data = data.replace('data:video/mp4;base64,', '');
    data = data.replace('data:video/mp3;base64,', '');
    data = data.replace('data:audio/mpeg;base64,', '');

    return data;
  }


  UploadMyFile(Data: any, name: any) {
    let file = this.prepareImageAsBinary(Data);
    return this.webApi.post('api/app/upload/upload-qYDFile', {
      fileContent: file,
      fileName: name
    });
  }
}
