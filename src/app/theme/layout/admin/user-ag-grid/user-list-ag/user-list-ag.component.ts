import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, ITextFilterParams } from 'ag-grid-community';
import { error } from 'console';
import { catchError, map, Subject, throwError } from 'rxjs';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType } from 'src/app/core/enums/common-enum';
import {
  ApiResponse,
  IColumnFilter,
  PaginationModel,
} from 'src/app/core/model/common-model';
import {
  IUserExport,
  IUserList,
  UserModel,
} from 'src/app/core/model/user-model';
import { CommonService } from 'src/app/core/services/common.service';
import { ActionCellRendererComponent } from 'src/app/pages/common/cell-renderers/action-cell-renderer/action-cell-renderer.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-list-ag',
  templateUrl: './user-list-ag.component.html',
  styleUrl: './user-list-ag.component.scss',
})
export class UserListAgComponent implements OnInit {
  columnDefs: ColDef[] = [
    {
      field: 'Id',
      headerName: 'Id',
      maxWidth: 250,
      pinned: false,
      lockPinned: true,
      flex: 1,
    },
    {
      field: 'FirstName',
      headerName: 'First Name',
      hide: false,
      pinned: false,
      flex: 1,
      lockPinned: true,
    },
    {
      field: 'LastName',
      headerName: 'Last Name',
      hide: false,
      pinned: false,
      lockPinned: true,
      flex: 1,
    },
    {
      field: 'Email',
      headerName: 'Email',
      hide: false,
      pinned: false,
      lockPinned: true,
      flex: 1,
    },
    {
      field: 'RoleName',
      headerName: 'Role Name',
      hide: false,
      pinned: false,
      lockPinned: true,
      flex: 1,
    },
    {
      field: 'Action',
      filter: false,
      sortable: false,
      headerName: 'Action',
      cellClass: 'noeditableCells pinned-cell',
      cellRenderer: ActionCellRendererComponent,
      cellRendererParams: {
        showDeleteButton: true,
        editWithModal: false,
        clicked: (
          actionType: string,
          data: string,
          name: string,
          image: string,
        ) => {
          if (actionType == 'delete') {
            Swal.fire({
              title: 'Are you sure?',
              text: "You won't be able to revert this!",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Yes, delete it!',
            }).then((result) => {
              if (result.isConfirmed) {
                this.onDeleteClick(data); // Call the delete function on confirmation
              }
            });
          }
        },
      },
      minWidth: 130,
      maxWidth: 135,
      lockPinned: true,
      pinned: 'right',
    },
  ];
  rowData!: IUserList[];
  // isLoading: boolean;
  perPage: number = 10;
  collectionSize: any;
  eventsSubject: Subject<void> = new Subject<void>();
  filterParams: PaginationModel = {
    PageNumber: 1,
    PageSize: 10,
    StrSearch: '',
    SortColumn: '',
    SortOrder: '',
    ColumnFilters: [],
  };
  defaultColDef: ColDef = {
    editable: false,
    sortable: true,
    resizable: true,
    filter: true,
    minWidth: 170,
    headerClass: 'text-center hover-class',
    cellClass: 'noeditableCells',
    filterParams: {
      filterOptions: ['contains'],
      trimInput: true,
      maxNumConditions: 1,
      closeOnApply: false,
      debounceMs: 1000,
    } as ITextFilterParams,
  };

  constructor(
    private apiUrl: ApiUrlHelper,
    private commonService: CommonService,
    private router: Router,
    private modalService: NgbModal,
  ) {}

  ngOnInit(): void {
    this.getAllUsers(this.filterParams);
  }

  onAddEdit(data: UserModel) {
    const id = data ? this.commonService.Encrypt(data?.UserId.toString()) : '';
    if (data) {
      this.router.navigate(['user/edit', id]);
    } else {
      this.router.navigate(['user/add']);
    }
  }

  onPageSizeChange(event: any) {
    this.filterParams.PageSize = event;
    this.getAllUsers(this.filterParams);
  }
  onPageChange(event: number) {
    this.filterParams.PageNumber = event;
    this.getAllUsers(this.filterParams);
  }
  sortChange(event: any) {
    const { colId = '', sort = '' } =
      event.api.sortController.getSortModel()[0] || {};
    this.filterParams.SortColumn = colId;
    this.filterParams.SortOrder = sort;
    this.getAllUsers(this.filterParams);
  }
  onFilterChange(event: IColumnFilter[]) {
    this.filterParams.ColumnFilters = event;
    this.getAllUsers(this.filterParams);
  }
  onGlobalSearch(event: string) {
    this.filterParams.StrSearch = event.trim();
    this.getAllUsers(this.filterParams);
  }
  onResetFilters() {
    this.filterParams.PageNumber = 1;
    this.filterParams.PageSize = 10;
    this.filterParams.SortColumn = '';
    this.filterParams.SortOrder = '';
    this.filterParams.StrSearch = '';
    this.getAllUsers(this.filterParams);
  }

  exportList(type: string): void {
    const params: PaginationModel = {
      ...this.filterParams,
      PageSize: this.collectionSize,
      PageNumber: 1,
    };

    Swal.fire({
      title: 'Export Data',
      text: 'How would you like to export the data?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Angular',
      cancelButtonText: 'ASP.NET',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Exporting through Angular...', '', 'success');
        this.exportThroughAngular(params);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Exporting through .NET...', '', 'success');
        this.exportThroughDotNet(params);
      }
    });
  }
  exportThroughAngular(params: PaginationModel) {
    this.commonService
      .doPost(this.apiUrl.apiUrl.user.getUserList, params)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data) {
            if (data.Data) {
              const filteredData: IUserExport[] = data.Data.map(
                (user: any) => ({
                  UserId: user.UserId,
                  FirstName: user.FirstName,
                  LastName: user.LastName,
                  Email: user.Email,
                  RoleName: user.RoleName,
                }),
              );
              this.commonService.exportToExcel(filteredData, 'userList');
            }
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }

  exportThroughDotNet(params: PaginationModel) {
    this.commonService
      .exportData(this.apiUrl.apiUrl.user.exportUserList, params)
      .subscribe({
        next: (response: Blob) => {
          // Create a link element to trigger the download
          const url = window.URL.createObjectURL(response);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'UserList.xlsx'; // Filename for the downloaded file
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('API error:', error);
        },
      });
  }

  onDeleteClick(data: string) {
    const apiUrl = this.apiUrl.apiUrl.user.deleteUser;

    let id = parseInt(this.commonService.Decrypt(data), 10);
    this.commonService
      .doDelete(apiUrl, id)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.commonService.showNotification(
              'User',
              data.Message,
              NotificationType.SUCCESS,
            );
            this.getAllUsers(this.filterParams);
          } else {
            this.commonService.showNotification(
              'User',
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

  getAllUsers(param: PaginationModel) {
    // Check if there are column filters and transform them if needed
    const transformedFilters = param.ColumnFilters?.map((filter) => {
      const columnName = Object.keys(filter)[0];
      const filterValue = filter[columnName].$regex;
      return {
        ColumnName: columnName,
        FilterValue: filterValue,
      };
    });

    // Create a new payload with transformed column filters
    const obj = {
      ...param,
      ColumnFilters: transformedFilters,
    };

    this.eventsSubject.next();
    this.commonService
      .doPost(this.apiUrl.apiUrl.user.getUserList, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data) {
            console.log('data', data);
            this.collectionSize = data?.Data[0]?.TotalFilteredRecord;
            // if (
            //   this.filterParams.ColumnFilters.length > 0 ||
            //   this.filterParams.StrSearch != ''
            // ) {
            //   this.collectionSize = data?.Data[0]?.TotalFilteredRecord;
            // }
            this.rowData = data.Data.map((element: any) => {
              const { UserId, ...rest } = element;
              return {
                Id: UserId,
                ...rest,
                editRoutePath: 'user/edit/',
              };
            });
          }
        },
        error: (error: Error) => {
          console.log(error);
        },
      });
  }
}
