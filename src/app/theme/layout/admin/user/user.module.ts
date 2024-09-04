import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserMasterComponent } from './user-master/user-master.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserListComponent } from './user-list/user-list.component';
import { DataTableModule } from 'src/app/pages/common/data-table/data-table.module';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [UserMasterComponent, UserListComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    NgSelectModule,
  ],
})
export class UserModule {}
