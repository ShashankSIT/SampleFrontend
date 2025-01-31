import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { SharedService } from '../core/services/shared.service';
import { CommonService } from '../core/services/common.service';

@Injectable()
export class HTTPStatus {
  private requestInFlight$: BehaviorSubject<boolean>;
  constructor() {
    this.requestInFlight$ = new BehaviorSubject(false);
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }
}

@Injectable()
export class HTTPListener implements HttpInterceptor {
  constructor(
    private router: Router,
    private status: HTTPStatus,
    private sharedService: SharedService,
    private commonService: CommonService,
  ) {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (!this.commonService.byPassLoader(req.url)) {
      this.sharedService.spinLoader$.next(false);
    }
    return next.handle(req).pipe(
      map((event) => {
        return event;
      }),
      catchError((error) => {
        this.sharedService.spinLoader$.next(false);
        if (error.status == 401) {
          localStorage.clear();
          this.commonService.goToLogin();
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.sharedService.spinLoader$.next(false);
        this.status.setHttpStatus(false);
      }),
    );
  }
}
