import { NgModule } from '@angular/core';

import { NewsRoutingModule } from './news-routing.module';
import { NewsListComponent } from './news-list/news-list.component';
import { SharedModule } from '@shared/shared.module';
import { NewsFormComponent } from './news-form/news-form.component';


@NgModule({
  declarations: [
    NewsListComponent,
    NewsFormComponent
  ],
  imports: [
    NewsRoutingModule,
    SharedModule,
  ]
})
export class NewsModule { }
