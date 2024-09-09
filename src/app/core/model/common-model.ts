export interface ApiResponse {
  Success: boolean;
  Message: string;
  Data: any;
  TAID: number;
}

export interface TableColumn {
  columnDef: string;
  title: string;
  isShow: boolean;
  buttons: Array<ButtonsConfig>;
}

export interface ApiConfigModel {
  url: string;
  requestData: any;
  type: string;
}

export interface PaginationModel {
  PageNumber: number;
  PageSize: number;
  StrSearch: string;
  SortColumn: string;
  SortOrder: string;
  ColumnFilters?: IColumnFilter[];
}

export interface IColumnFilter {
  [key: string]: {
    $regex: string;
    $options: string;
  };
}

export interface ButtonsConfig {
  Text: string;
  Icon: string;
  Type: string;
  Title: string;
  IsConfirm: boolean;
  // ConfirmText: string;
  // ConfirmTitle: string;
  // ConfirmButtonColor: string;
  // CancelButtonColor: string;
  // ConfirmButtonText: string;
  // constructor() {
  //     Text: 'Are you sure?';
  //     Icon: '';
  //     Type: '';
  //     Title: '';
  //     IsConfirm: false;
  //     ConfirmText: "You won't be able to revert this!";
  //     ConfirmTitle: 'Are you sure?';
  //     ConfirmButtonColor: '#3085d6';
  //     CancelButtonColor: '#d33';
  //     ConfirmButtonText: 'Yes, delete it!';
  // }
}

export interface ActionEvent {
  Type: string;
  Data: any;
}
