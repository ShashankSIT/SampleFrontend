import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, of, tap } from 'rxjs';
import { ApiResponse } from '../model/common-model';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { NotificationType } from '../enums/common-enum';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { Buffer } from 'buffer';
import { StorageKey } from './storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private key = CryptoJS.enc.Utf8.parse('669DA974-AA2F-1429-AD1A-64FEF721F1FF');
  private iv = CryptoJS.enc.Utf8.parse('669DA974-AA2F-1429-AD1A-64FEF721F1FF');
  constructor(
    private toastr: ToastrService,
    private http: HttpClient,
    private apiUrl: ApiUrlHelper,
    private router: Router,
  ) {}

  doGet(apiUrl: string): Observable<ApiResponse> {
    const httpOptions = {
      headers: new HttpHeaders(),
    };
    const loginData = JSON.parse(
      this.Decrypt(localStorage.getItem(StorageKey.loginData)),
    );
    if (loginData) {
      httpOptions.headers = httpOptions.headers.set(
        'Authorization',
        'Bearer ' + loginData.JWTToken,
      );
    }
    const url = `${environment.apiUrl}${apiUrl}`;
    return this.http.get<ApiResponse>(url, httpOptions).pipe(
      tap(() => this.log(`doGet success`)),
      catchError(
        this.handleError<ApiResponse>(`doGet url = ${JSON.stringify(apiUrl)}`, {
          Data: null,
          Message: 'Something went wrong. Please try again after sometime.',
          Success: false,
          TAID: null,
        }),
      ),
    );
  }

  doPost(apiUrl: string, postData: any): Observable<ApiResponse> {
    const httpOptions = {
      headers: new HttpHeaders(),
    };
    const loginData = JSON.parse(
      this.Decrypt(localStorage.getItem(StorageKey.loginData)),
    );
    if (loginData) {
      httpOptions.headers = httpOptions.headers.set(
        'Authorization',
        'Bearer ' + loginData.JWTToken,
      );
    }

    const url = `${environment.apiUrl}${apiUrl}`;
    return this.http.post<ApiResponse>(url, postData, httpOptions).pipe(
      tap(() => this.log(`doPost success`)),
      catchError(
        this.handleError<ApiResponse>(
          `doPost data = ${JSON.stringify(postData)}`,
          {
            Data: null,
            Message: 'Something went wrong. Please try again after sometime.',
            Success: false,
            TAID: null,
          },
        ),
      ),
    );
  }

  downloadFile(apiUrl: string): any {
    const httpOptions = {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'json',
    };
    const loginData = JSON.parse(
      this.Decrypt(localStorage.getItem(StorageKey.loginData)),
    );
    if (loginData) {
      httpOptions.headers = httpOptions.headers.set(
        'Authorization',
        'Bearer ' + loginData.JWTToken,
      );
    }
    const url = `${environment.apiUrl}${apiUrl}`;
    return this.http.get(url, httpOptions).pipe(
      tap(() => this.log(`downloadFile success`)),
      catchError(
        this.handleError(
          `downloadFile url = ${JSON.stringify(apiUrl)}`,
          new Blob(),
        ),
      ),
    );
  }

  doDelete(apiUrl: string, idtoDelete: number): Observable<ApiResponse> {
    const httpOptions = {
      headers: new HttpHeaders(),
    };
    const loginData = JSON.parse(
      this.Decrypt(localStorage.getItem(StorageKey.loginData)),
    );
    if (loginData) {
      httpOptions.headers = httpOptions.headers.set(
        'Authorization',
        'Bearer ' + loginData.JWTToken,
      );
    }

    const options = {
      headers: httpOptions.headers,
      body: {
        id: idtoDelete,
      },
    };

    const url = `${environment.apiUrl}${apiUrl}`;
    return this.http.delete<ApiResponse>(url, options).pipe(
      tap(() => this.log(`doDelete success`)),
      catchError(
        this.handleError<ApiResponse>(
          `doDelete url = ${JSON.stringify(apiUrl)}`,
          {
            Data: null,
            Message: 'Something went wrong. Please try again after sometime.',
            Success: false,
            TAID: null,
          },
        ),
      ),
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log('Log from service : ' + message);
  }

  encodeBase64(plainString: string): string {
    return Buffer.from(plainString, 'ascii').toString('base64');
  }

  decodeBase64(Base64String: string): string {
    if (Base64String) {
      return Buffer.from(Base64String, 'base64').toString('ascii');
    } else {
      return '""';
    }
  }

  public Encrypt(clearText: string): string {
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(clearText),
      this.key,
      {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      },
    );
    return encrypted.toString();
  }

  public Decrypt(cipherText: string): string {
    if (cipherText) {
      const decrypted = CryptoJS.AES.decrypt(cipherText, this.key, {
        keySize: 128 / 8,
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } else {
      return '""';
    }
  }

  showNotification(title: string, message: string, type: NotificationType) {
    const from = 'top',
      align = 'right';

    switch (type) {
      case 1:
        this.toastr.info(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
            message +
            '</span>',
          title,
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            positionClass: 'toast-' + from + '-' + align,
          },
        );
        break;
      case 2:
        this.toastr.success(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
            message +
            '</span>',
          title,
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            positionClass: 'toast-' + from + '-' + align,
          },
        );
        break;
      case 3:
        this.toastr.warning(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
            message +
            '</span>',
          title,
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            positionClass: 'toast-' + from + '-' + align,
          },
        );
        break;
      case 4:
        this.toastr.error(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
            message +
            '</span>',
          title,
          {
            timeOut: 4000,
            enableHtml: true,
            closeButton: true,
            positionClass: 'toast-' + from + '-' + align,
          },
        );
        break;
      case 5:
        this.toastr.show(
          '<span data-notify="icon" class="nc-icon nc-bell-55"></span><span data-notify="message">' +
            message +
            '</span>',
          title,
          {
            timeOut: 4000,
            closeButton: true,
            enableHtml: true,
            positionClass: 'toast-' + from + '-' + align,
          },
        );
        break;
      default:
        break;
    }
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

  getApiURL(url: string, requestData: any): string {
    if (requestData) {
      const queryParams: string[] = [];
      Object.keys(requestData).forEach((key) => {
        queryParams.push(key + '=' + requestData[key]);
      });
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }
    }
    return url;
  }

  // New changes
  public role_rights = [];
  async getMenuListByRoleId(RoleId: any) {
    const apiUrl = this.apiUrl.apiUrl.rolerights.getMenuListByRoleId + RoleId;
    const roleRights = await this.doGet(apiUrl).toPromise();
    this.role_rights = roleRights.Data;
  }

  public checkRoleRights(_url: string, type: string) {
    const data = this.role_rights.find(
      (x) => x.menuUrl == _url && x.menuUrl != '',
    );
    if (type == 'add') {
      return data && data.isAdd ? true : false;
    } else if (type == 'edit') {
      return data && data.isEdit ? true : false;
    } else if (type == 'delete') {
      return data && data.isDelete ? true : false;
    }
    return false;
  }

  public byPassLoader(apiUrl: string): boolean {
    if (apiUrl.toLowerCase().includes('dropdown')) {
      return true;
    }
    if (apiUrl.indexOf(this.apiUrl.apiUrl.user.getUserDropdownList) == -1) {
      return false;
    }
    return true;
  }
}
