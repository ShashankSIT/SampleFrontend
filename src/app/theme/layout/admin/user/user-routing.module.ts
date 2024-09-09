import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserMasterComponent } from './user-master/user-master.component';
import { canActivate } from 'src/app/auth-gaurd/auth.guard';
import { UserListComponent } from './user-list/user-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
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
  {
    path : 'profile',
    component : UserProfileComponent,
    canActivate: [canActivate],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
