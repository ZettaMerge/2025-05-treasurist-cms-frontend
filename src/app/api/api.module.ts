import { NgModule } from '@angular/core';
import { CustomerService } from '@api';

import { MeService } from './service/me.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [
    MeService,
    CustomerService,
  ]
})
export class ApiModule { }
