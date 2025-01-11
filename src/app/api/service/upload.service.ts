import { Injectable } from '@angular/core';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(protected api: PnApiClientService) { }

  public uploadImagePost$(file: any, bucket: string): Observable<any> {
    return this.api.multipartPost(`${apiBaseUrl()}/manage/upload-image/`, {file}, {bucket});
  }

  public deleteFilePost$(url: any): Observable<any> {
    return this.api.multipartPost(`${apiBaseUrl()}/manage/deleteFile/`, {}, {url});
  }
}
