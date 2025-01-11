import {Injectable} from '@angular/core';
import {
  AssessmentSelectDTO, OpenAccountDTO
} from '@model';
import {PnApiClientService} from '@postnerd-core';
import {Observable} from 'rxjs';
import {apiBaseUrl} from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class AssetmentService {

  constructor(protected api: PnApiClientService) {
  }

  public assetmentIdGet$(userId: number): Observable<AssessmentSelectDTO> {
    return this.api.get(`${apiBaseUrl()}/manage/assessment/selected-choices/${encodeURIComponent(String(userId))}`, undefined);
  }

  public assetmentPost$(dto: AssessmentSelectDTO, userId: number): Observable<AssessmentSelectDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/assessment/submit/${encodeURIComponent(String(userId))}`, dto, undefined);
  }


}
