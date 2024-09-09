import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListAgComponent } from './user-list-ag/user-list-ag.component';
import { canActivate } from 'src/app/auth-gaurd/auth.guard';
import { UserMasterComponent } from '../user/user-master/user-master.component';

const routes: Routes = [
  {
    path: 'ag-grid',
    component: UserListAgComponent,
    canActivate: [canActivate],
  },
  {
    path: 'add',
    component: UserMasterComponent,
    canActivate: [canActivate],
  },
  {
    path: 'edit/:id',
    component: UserMasterComponent,
    canActivate: [canActivate],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserAgGridRoutingModule {}
