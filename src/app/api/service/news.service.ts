import { Injectable } from '@angular/core';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { NewsDTO } from '@model';
import { apiBaseUrl } from '../api-base-url';
import { ListResponseNewsDTO } from '../model/ListResponseNewsDTO';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  constructor(protected api: PnApiClientService) { }

  public newsIdGet$(id: number): Observable<NewsDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/news/${encodeURIComponent(String(id))}`, undefined);
  }

  public newsListGet$(columnName?: string, direction?: string, limit?: number, page?: number, title?: string, status?: string, isFeature?: boolean, isPinned?: boolean): Observable<ListResponseNewsDTO<NewsDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/news`, { direction, columnName, limit, page, title, status, isFeature, isPinned });
  }

  public newsPost$(body: NewsDTO): Observable<NewsDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/news`, body, undefined);
  }

  public newsPut$(id: number, body: NewsDTO): Observable<NewsDTO> {
    return this.api.put(`${apiBaseUrl()}/manage/news/${encodeURIComponent(String(id))}`, body, undefined);
  }

  public newsDelete$(id: number): Observable<NewsDTO> {
    return this.api.delete(`${apiBaseUrl()}/manage/news/${encodeURIComponent(String(id))}`, undefined);
  }
}
