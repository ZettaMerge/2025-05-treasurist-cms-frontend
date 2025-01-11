import { Injectable } from '@angular/core';
import { CurrentUserDTO } from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class MeService {

  constructor(protected api: PnApiClientService) { }

  public meGet$(): Observable<CurrentUserDTO> {
    return this.api.get(`${apiBaseUrl()}/current-user`, {});
  }
}
