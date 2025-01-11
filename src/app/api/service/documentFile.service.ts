import {Injectable} from '@angular/core';
import {DocumentFileDTO, ListResponseDocumentFileDTO} from '@model';
// import { DocumentFileDTO, ListResponseDocumentFileDTO } from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class DocumentFileService {

  constructor(protected api: PnApiClientService) {
  }


  public documentFilesListGet$(limit: number, page: number, docFileCategory?: string, docFileType?: string, search?: string): Observable<ListResponseDocumentFileDTO<DocumentFileDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/document-files`, {limit, page, docFileCategory, docFileType, search});
  }

  public documentFilesPost$(body: DocumentFileDTO): Observable<DocumentFileDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/document-files`, body, undefined);
  }

  public documentFilesIdGet$(id: number): Observable<DocumentFileDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/document-files/${encodeURIComponent(String(id))}`, undefined);
  }

  public documentFilesPut$(body: DocumentFileDTO, id: number): Observable<DocumentFileDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/document-files/${encodeURIComponent(String(id))}`, body, undefined);
  }

  public documentFilesDelete$(id: number): Observable<any> {
    return this.api.delete(`${apiBaseUrl()}/manage/document-files/${encodeURIComponent(String(id))}`, undefined);
  }

  public documentFilesAllGet$(): Observable<DocumentFileDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/document-files/get-all`, undefined);
  }
}
