import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import {
  ActionType,
  ApiType,
  NotificationType,
  TableType,
} from 'src/app/core/enums/common-enum';
import {
  ActionEvent,
  ApiConfigModel,
  TableColumn,
} from 'src/app/core/model/common-model';
import { UserModel } from 'src/app/core/model/user-model';
import { CommonService } from 'src/app/core/services/common.service';
import { DataListComponent } from 'src/app/pages/common/data-table/data-list/data-list.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent {
  @ViewChild('dataList') dataList: any = DataListComponent;
  colDefs: TableColumn[] = [
    {
      columnDef: 'FirstName',
      title: 'First Name',
      isShow: true,
      buttons: [],
    },
    {
      columnDef: 'LastName',
      title: 'Last Name',
      isShow: true,
      buttons: [],
    },
    {
      columnDef: 'Email',
      title: 'Email',
      isShow: true,
      buttons: [],
    },
    {
      columnDef: 'RoleName',
      title: 'Role',
      isShow: true,
      buttons: [],
    },
    {
      columnDef: 'Action',
      title: 'Action',
      isShow: true,
      buttons: [
        {
          Text: '',
          Icon: 'feather icon-edit',
          Type: ActionType.Edit,
          IsConfirm: false,
          Title: ActionType.Edit,
        },
        {
          Text: '',
          Icon: 'feather icon-trash-2',
          Type: ActionType.Delete,
          IsConfirm: true,
          Title: ActionType.Delete,
        },
      ],
    },
  ];
  apiDetails: ApiConfigModel = {
    url: this.apiUrl.apiUrl.user.getUserList,
    requestData: {},
    type: ApiType.Post,
  };
  tableType: TableType = TableType.Pagination;

  constructor(
    private apiUrl: ApiUrlHelper,
    private commonService: CommonService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  onAddEdit(data: UserModel) {
    const id = data ? this.commonService.Encrypt(data?.UserId.toString()) : '';
    if (data) {
      this.router.navigate(['user/edit', id]);
    } else {
      this.router.navigate(['user/add']);
    }
  }

  onDelete(data: UserModel) {
    const apiUrl = this.apiUrl.apiUrl.user.deleteUser;
    this.commonService
      .doDelete(apiUrl, data.UserId)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.commonService.showNotification(
              'User',
              data.Message,
              NotificationType.SUCCESS,
            );
            this.dataList.initList();
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

  onAction(event: ActionEvent) {
    if (event) {
      if (event.Type == ActionType.Edit) {
        this.onAddEdit(event.Data);
      } else if (event.Type == ActionType.Delete) {
        this.onDelete(event.Data);
      }
    }
  }
}
