import { Injectable } from '@angular/core';
import { profile } from 'console';

@Injectable({
  providedIn: 'root',
})
export class ApiUrlHelper {
  public apiUrl = {
    login: {
      loginUser: 'login/LoginUser',
      forgotPassword: 'login/ForgotPassword',
      resetForgotPassword: 'login/ResetForgotPassword',
      validateResetPassword: 'login/ValidateResetPassword',
      resetPassword: 'login/ResetPassword',
      validateTwoFactorCode: 'login/ValidateTwoFactorCode',
      resetCode: 'login/ResetCode',
    },
    dashboard: {
      saveDashboardMaster: 'DashboardApi/SaveDashboardMaster',
      getDashboardMasterDetail: 'DashboardApi/GetDashboardMasterDetail',
      getGRSMaterialPurchasesDetail:
        'DashboardApi/GetGRSMaterialPurchasesDetail',
      getCarbonReductionChartMasterDetail:
        'DashboardApi/GetCarbonReductionChartMasterDetail',
    },
    rolerights: {
      getMenuListByRoleId: 'rolerights/GetRoleRightsByRoleId/',
    },
    user: {
      saveUser: 'user/SaveUser',
      getRolesList: 'user/GetRolesList',
      getUserList: 'user/GetUserList',
      getUserDropdownList: 'user/GetUserDropdownList',
      getCompanyDropdownList: 'user/GetCompanyDropdownList',
      getBranchDropdownList: 'user/GetBranchDropdownList',
      deleteUser: 'user/deleteUser',
    },
    userprofile : {
      getLanguageList: 'userprofile/GetLanguageList',
      getUserDetailById : 'userprofile/GetUserDetailById',
      saveUserProfileDetail : 'userprofile/SaveUserProfileDetail'
    }
  };
}
