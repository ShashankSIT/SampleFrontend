import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAgGridRoutingModule } from './user-ag-grid-routing.module';
import { UserListAgComponent } from './user-list-ag/user-list-ag.component';
import { DataTableModule } from 'src/app/pages/common/data-table/data-table.module';
import { CellRendererModule } from 'src/app/pages/common/cell-renderers/cell-renderer.module';
import { CommonComponentModule } from 'src/app/pages/common/common.module';

@NgModule({
  declarations: [UserListAgComponent],
  imports: [
    CommonModule,
    UserAgGridRoutingModule,
    DataTableModule,
    CellRendererModule,
    CommonComponentModule,
  ],
})
export class UserAgGridModule {}
