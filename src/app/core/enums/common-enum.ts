export enum NotificationType {
  INFO = 1,
  SUCCESS = 2,
  WARNING = 3,
  ERROR = 4,
  SHOW = 5,
}

export enum ApiType {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Delete = 'DELETE',
}

export enum TableType {
  Pagination = 'Pagination',
  Normal = 'Normal',
}

export enum ActionType {
  View = 'View',
  Edit = 'Edit',
  Print = 'Print',
  Delete = 'Delete',
}

export enum ModalActionType {
  Save = 'Save',
  Close = 'Close',
}

export enum RoleName {
  SuperAdmin = 'Super Admin',
  Admin = 'Admin',
  Customer = 'Customer',
  CustomerAdmin = 'Customer Admin',
}
