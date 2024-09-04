import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './auth.service';
import { CommonService } from '../core/services/common.service';
import { StorageKey, StorageService } from '../core/services/storage.service';
import { NotificationType } from '../core/enums/common-enum';

@Injectable()
export class canActivate implements CanActivate {
  constructor(
    private router: Router,
    private commonService: CommonService,
    private storageService: StorageService,
    private authService: AuthService,
  ) {}
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isLoggedIn()) {
      localStorage.clear();
      this.commonService.goToLogin();
      return false;
    } else {
      const userData = this.storageService.getValue(StorageKey.loginData);
      if (!(this.commonService.role_rights.length > 0)) {
        await this.commonService.getMenuListByRoleId(userData.RoleId);
      }
      //console.log(this.commonService.role_rights);
      const _url = state.url;
      if (_url.includes('edit')) {
        const parts = _url.split('/edit/');
        const menuUrl = parts[0];

        const data = this.commonService.role_rights.find(
          (x) => x.MenuUrl === menuUrl,
        );
        if (data.IsEdit) {
          return true;
        } else {
          this.commonService.showNotification(
            'Unauthorized',
            `You don't have permission to perform this action`,
            NotificationType.ERROR,
          );
          return false;
        }
      } else if (_url.includes('add')) {
        const parts = _url.split('/add');
        const menuUrl = parts[0];

        const data = this.commonService.role_rights.find(
          (x) => x.MenuUrl === menuUrl,
        );
        if (data.IsAdd) {
          return true;
        } else {
          this.commonService.showNotification(
            'Unauthorized',
            `You don't have permission to perform this action`,
            NotificationType.ERROR,
          );
          return false;
        }
      } else {
        const data = this.commonService.role_rights.find(
          (x) => x.MenuUrl == _url && x.MenuUrl != '',
        );
        if (data.IsView) {
          return true;
        }
      }

      const chk_url = this.commonService.role_rights.filter(
        (x) => x.IsView == true && x.menuUrl != '',
      );
      if (chk_url && chk_url.length > 0 && chk_url[0].MenuUrl) {
        this.router.navigate([chk_url[0].MenuUrl]);
        return false;
      } else {
        localStorage.clear();
        this.router.navigate(['/auth/login']);
        return false;
      }
    }
    return true;
  }
}
