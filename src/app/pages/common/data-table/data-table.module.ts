import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataListComponent } from './data-list/data-list.component';
import { DataTablesModule } from 'angular-datatables';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { DatatableComponent } from './datatable/datatable.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonComponentModule } from '../common.module';

@NgModule({
  declarations: [DataListComponent, DatatableComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    MatTableModule,
    AgGridModule,
    NgbPaginationModule,
    NgSelectModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    CommonComponentModule,
  ],
  exports: [DataListComponent, DatatableComponent],
})
export class DataTableModule {}
