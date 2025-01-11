import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './news-list/news-list.component';
import { NewsFormComponent } from './news-form/news-form.component';
import {PermissionGuard} from "@app/core/guard/permission.guard";
import {PermissionEnum} from "@app/core/variables/permission.enum";

const routes: Routes = [
  {
    path: 'news',
    component: NewsListComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [PermissionEnum.News]
    }
  },
  {
    path: 'news/new',
    component: NewsFormComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [PermissionEnum.News]
    }
  },
  {
    path: 'news/edit/:id',
    component: NewsFormComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [PermissionEnum.News]
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule { }
