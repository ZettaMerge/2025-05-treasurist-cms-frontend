import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpInterceptor, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { defaultConfig, PnApiClientConfig } from './pn-api-client.config';
import { pnUserApiClientConfigToken } from './pn-user-config.token';
import { catchError, mergeMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PnAuthServiceBase } from '../auth/pn-auth.service.base'
import * as moment from 'moment';
import {PnStorageService} from '../storage/pn-storage.service';
import {PnAuthVariablesService} from '../auth/pn-auth-variables.service';

@Injectable({
  providedIn: 'root',
})
export class PnDateRequestInterceptor implements HttpInterceptor {

  config = {} as PnApiClientConfig;
  constructor(
    @Inject(pnUserApiClientConfigToken) userConfig: PnApiClientConfig,
    private pnAuthService: PnAuthServiceBase,
    private pnStorageService: PnStorageService,
    private pnAuthVariablesService: PnAuthVariablesService,
  ) {
    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    // params
    const keys = request.params.keys();
    const modifiedParams: any = {};
    for (const key of keys) {
      const obj = request.params.get(key) as any;
      if (obj instanceof Date) {
        if (this.config.dateRequestFormatter) {
          modifiedParams[key] = this.config.dateRequestFormatter(obj);
        } else {
          modifiedParams[key] = obj.toISOString();
        }
      }
    }
    if (Object.keys(modifiedParams).length > 0) {
      request = request.clone({
        setParams: modifiedParams,
      });
    }
    // body
    if (request.method === 'POST' || request.method === 'PUT') {
      if (request.body && !(request.body instanceof FormData)) {
        const contentType = request.detectContentTypeHeader();
        if (!contentType || (contentType && !contentType.startsWith('application/x-www-form-urlencoded'))) {
          const formatted = this.iterateFormatDate(request.body);
          request = request.clone({
            body: formatted,
          });
        }
      }
    }
    if(this.config.enableRefreshToken){
      const expiresAt = parseInt(this.pnStorageService.getItem('expires_at'));
      const expireDate = moment(expiresAt, 'x');
      // do something
      if (expiresAt && expireDate.diff(moment(), 'hours') <= 2) {
        this.pnAuthVariablesService.refreshTokenSubject.next('refresh');
      }
    }
    // @ts-ignore
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        let errorInfo;
        if (typeof error === 'string') {
          errorInfo = JSON.parse(error);
        } else {
          errorInfo = error;
        }
        console.log('errorType', typeof error);
        return throwError(error);
      } else {
        return throwError(error);
      }
    }));
    // return next.handle(request);
  }

  private iterateFormatDate(obj) {
    let newObj;
    if (Array.isArray(obj)) {
      newObj = [];
    } else {
      newObj = {};
    }
    Object.keys(obj).forEach(key => {
      if (obj[key] instanceof Date) {
        if (this.config.dateRequestFormatter) {
          newObj[key] = this.config.dateRequestFormatter(obj[key]);
        } else {
          newObj[key] = obj[key].toISOString();
        }
      } else if (typeof obj[key] === 'object' && !(obj[key] instanceof FormData) && obj[key]) {
        newObj[key] = this.iterateFormatDate(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    });
    return newObj;
  }
}
