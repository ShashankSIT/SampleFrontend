import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Observable, Subject, catchError, map, throwError } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Config } from 'datatables.net';
import {
  ActionEvent,
  ApiConfigModel,
  ApiResponse,
  ButtonsConfig,
  PaginationModel,
  TableColumn,
} from 'src/app/core/model/common-model';
import {
  ApiType,
  NotificationType,
  TableType,
} from 'src/app/core/enums/common-enum';
import { CommonService } from 'src/app/core/services/common.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import swal from 'sweetalert2';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.scss',
})
export class DataListComponent implements AfterViewInit {
  isFirstTime: boolean = true;

  itemList: any = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [];
  searchTerm: string = '';
  totalRecord: number = 0;
  pagination: PaginationModel = {
    PageNumber: 1,
    PageSize: 10,
    StrSearch: this.searchTerm,
    SortColumn: '',
    SortOrder: '',
  };
  sortColumn: string = '';
  sortOrder: string = '';
  searchTimeout: any = setTimeout(() => {}, 0);

  @Input() columns: Array<TableColumn>;
  @Input() apiDetails: ApiConfigModel;
  @Input() tableType: string = TableType.Normal;

  @Output() onActionEvent = new EventEmitter<any>();

  constructor(private commonService: CommonService) {}

  ngOnInit(): void {
    this.initList();
  }

  ngAfterViewInit(): void {
    if (this.dataSource.filteredData.length > 0) {
      this.setTablePagination();
    }
  }

  initList() {
    this.displayedColumns = this.columns
      .filter((a) => a.isShow == true)
      .map((d) => d.columnDef);

    if (this.tableType == TableType.Pagination) {
      Object.keys(this.pagination).forEach((key) => {
        this.apiDetails.requestData[key] = this.pagination[key];
      });
    }

    this.fetchRecords().subscribe({
      next: (data) => {
        if (data && data.Success) {
          this.itemList = data.Data;
          this.dataSource = new MatTableDataSource<any>(this.itemList);
          this.totalRecord =
            this.itemList &&
            this.itemList.length > 0 &&
            this.tableType == TableType.Pagination
              ? this.itemList[0].TotalFilteredRecord
              : this.itemList?.length;
          this.setTablePagination();
        } else {
          this.commonService.showNotification(
            'List',
            data.Message,
            NotificationType.ERROR,
          );
        }
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  fetchRecords(): Observable<any> {
    let apiUrl = this.apiDetails.url;
    if (this.apiDetails.type == ApiType.Get) {
      apiUrl = this.commonService.getApiURL(
        apiUrl,
        this.apiDetails.requestData,
      );
      return this.commonService.doGet(apiUrl).pipe(
        map((data: ApiResponse) => {
          return data;
        }),
        catchError((error) => {
          return throwError(() => new Error(error));
        }),
      );
    } else if (this.apiDetails.type == ApiType.Post) {
      return this.commonService
        .doPost(apiUrl, this.apiDetails.requestData)
        .pipe(
          map((data: ApiResponse) => {
            return data;
          }),
          catchError((error) => {
            return throwError(() => new Error(error));
          }),
        );
    } else {
      return null;
    }
  }

  pageChanged(event: any) {
    if (event && this.tableType == TableType.Pagination) {
      this.pagination = {
        PageNumber: event.pageIndex + 1,
        PageSize: event.pageSize,
        StrSearch: this.searchTerm,
        SortColumn: this.sortColumn,
        SortOrder: this.sortOrder,
      };
      this.initList();
    }
  }

  sortChange(event: any) {
    if (event && this.tableType == TableType.Pagination) {
      this.sortColumn = event.active;
      this.sortOrder = event.direction;
      this.pagination.SortColumn = this.sortColumn;
      this.pagination.SortOrder = this.sortOrder;
      this.initList();
    }
  }

  seacrchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      if (this.tableType == TableType.Pagination) {
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
        this.pagination.StrSearch = this.searchTerm;
        this.pagination.PageNumber = 1;
        this.initList();
      } else {
        this.dataSource.filter = this.searchTerm.trim().toLowerCase();
      }
    }, 500);
  }

  onAction(buttonDef: ButtonsConfig, data: any) {
    const EventData: ActionEvent = {
      Type: buttonDef.Type,
      Data: data,
    };
    if (buttonDef.IsConfirm) {
      swal
        .fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!',
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.onActionEvent.emit(EventData);
          }
        });
    } else {
      this.onActionEvent.emit(EventData);
    }
  }

  setTablePagination() {
    if (this.isFirstTime) {
      this.isFirstTime = false;
      this.dataSource.paginator = this.paginator;
    }
    this.dataSource.sort = this.sort;
  }

  getColumnDetails(type: string, columnDef: string): any {
    if (type == 'title') {
      return this.columns.find((d) => d.columnDef == columnDef).title;
    } else if (type == 'button') {
      return this.columns.find((d) => d.columnDef == columnDef).buttons;
    }
    return '';
  }
}
