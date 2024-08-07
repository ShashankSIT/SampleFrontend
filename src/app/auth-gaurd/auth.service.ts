import { Injectable } from '@angular/core';
import { CommonService } from '../core/services/common.service';
import { ApiUrlHelper } from '../config/apiUrlHelper';
import { StorageKey, StorageService } from '../core/services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private commonService: CommonService,
    private storageService: StorageService,
    private apiUrl: ApiUrlHelper) { }

  isLoggedIn(): boolean {
    const loginData = this.storageService.getValue(StorageKey.loginData);
    if (loginData) {
      const payload = this.commonService.decodeBase64(loginData.JWTToken.split('.')[1]); // decode payload of token
      const parsedPayload = JSON.parse(payload); // convert payload into an Object
      return parsedPayload.exp > Date.now() / 1000; // check if token is expired
    }
    return false;
  }
  public role_rights = [];
  async getMenuListByRoleId() {
    const apiUrl = this.apiUrl.apiUrl.rolerights.getMenuListByRoleId;
    let roleRights = await this.commonService.doPost(apiUrl, {}).toPromise();
    this.role_rights = roleRights.Data;
  }
}
