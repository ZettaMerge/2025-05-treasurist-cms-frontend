import { Injectable } from '@angular/core';
import {ListResponseUserDTO, TeamDropdownDTO, TeamDTO, UserDTO} from '@model';
import { PnApiClientService } from '@postnerd-core';
import { Observable } from 'rxjs';
import { apiBaseUrl } from '../api-base-url';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  constructor(protected api: PnApiClientService) { }


  public teamPost$(body: TeamDTO): Observable<TeamDTO> {
    return this.api.post(`${apiBaseUrl()}/manage/teams`, body, undefined);
  }

  public dropdownTeamGet$(name?: string): Observable<Array<TeamDropdownDTO>> {
    return this.api.get(`${apiBaseUrl()}/manage/teams/get-all`, { name });
  }

}
