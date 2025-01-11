import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeIndexTypeListComponent } from './fe-index-type-list/fe-index-type-list.component';
import { PermissionGuard } from '@app/core/guard/permission.guard';
import { PermissionEnum } from '@app/core/variables/permission.enum';

const routes: Routes = [
  {
    path: 'index-type',
    component: FeIndexTypeListComponent,
    canActivate: [PermissionGuard],
    data: {
      permissions: [PermissionEnum.IndexType]
    }
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IndexTypeRoutingModule { }
