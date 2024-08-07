import { Injectable } from '@angular/core';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private commonService: CommonService
  ) { }

  getValue(key: string): any {
    if (key == StorageKey.loginData) {
      const info = this.commonService.Decrypt(localStorage.getItem(key));
      return info ? JSON.parse(info) : '';
    }
    else {
      let loginData = JSON.parse(this.commonService.Decrypt(localStorage.getItem(StorageKey.loginData)));
      if (loginData[key]) {
        return loginData[key];
      }
    }
  }

  setValue(key: string, value: any): void {
    let newValue = '';
    if (typeof value == 'object') {
      newValue = this.commonService.Encrypt(JSON.stringify(value));
    }
    else {
      newValue = this.commonService.Encrypt(value);
    }
    localStorage.setItem(key, newValue);
  }

  removeValue(key: string): void {
    localStorage.removeItem(key);
  }

  clearStorage() {
    localStorage.clear();
    this.commonService.role_rights = [];
  }
}


export class StorageKey {
  public static loginData = 'LoginData';
  public static branchId = 'BranchId';
}
