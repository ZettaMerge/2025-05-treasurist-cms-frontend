import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {PnStorageService} from '../storage/pn-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PnAuthVariablesService {

  public refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
  ) {
  }

}
