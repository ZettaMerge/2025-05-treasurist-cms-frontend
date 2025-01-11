import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PnStorageService } from '@postnerd-core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {

  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public focusUserImageProfileSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    // private meService: MeService,
    // private usersService: UsersService,
    private pnStorageService: PnStorageService
  ) {
  }
}
