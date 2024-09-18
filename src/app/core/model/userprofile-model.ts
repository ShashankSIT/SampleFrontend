export interface UserDetailModel {
  UserDetailId: number | null;
  FirstName: string | null;
  LastName: string | null;
  Email: string | null;
  PhoneNo: number | null;
  UserPhoto: string | null;
  Gender: string | null;
  DOB: string | null;
  Address: Array<AddressModel> | null;
  Languages: string | null;
  FormatLanguages: string[] | null;
  LoggedInUserId: number;
  LoggedInEmailId: string | null;
  IsActive: boolean | null;
  IsDelete: boolean | null;
  CreatedBy: number | null;
  CreatedOn: string | null;
  StrCreatedOn: string | null;
  UpdatedBy: number | null;
  UpdatedOn: string | null;
  StrUpdatedOn: string | null;
  LoginToken: string | null;
  BranchId: number | null;
}

export interface CountryModel {
  CountryId: number;
  CountryName: string;
}

export interface StateModel {
  StateId: number;
  StateName: string;
  CountryId: number;
}

export interface CityModel {
  CityId: number;
  CityName: string;
  StateId: number;
}

export interface AddressModel {
  AddressId: number;
  Address1: string;
  Address2: string;
  CountryId: number;
  StateId: number;
  CityId: number;
  UserDetailId: number;
  CountryName : string;
  StateName : string;
  CityName : string;
}
