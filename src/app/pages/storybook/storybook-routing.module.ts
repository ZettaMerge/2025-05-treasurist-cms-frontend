import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StorybookComponent } from './storybook.component';

const routes: Routes = [
  {
    path: 'storybook',
    component: StorybookComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StorybookRoutingModule { }
