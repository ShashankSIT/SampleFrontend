
export interface UserDetailModel {
    UserDetailId: number | null;
    FirstName: string | null;
    LastName: string | null;
    Email: string | null;
    PhoneNo: number | null;
    UserPhoto: string | null;
    Gender: string | null;
    DOB: string | null;
    Address: string | null;
    Languages: string | null;
    FormatLanguages : string[] | null;
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


