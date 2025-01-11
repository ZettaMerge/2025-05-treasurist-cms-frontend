import {ApiErrorHandler} from '../api-client/pn-api-error.model';

export interface PnAuthServiceConfig {
  // auth service
  authenticationScheme?: string;
  tokenUrl: string;
  refreshTokenUrl?: string;
  isFormData: boolean;
  isJWT: boolean;
  scope?: string;
  clientId?: string;
  subSystemCode?: string;
}

export interface PnAuthInterceptorConfig {
  autoRefreshToken?: boolean;
  loginScreenUrl?: string;
  forceSendToken?: boolean;
}

export interface PnAuthRequestKey {
  username: string;
  password: string;
  deviceId?: string;
  subSystemCode?: string;
  subSystem?: string;
  refresh_token?: string;
}

export interface PnAuthResponseKey {
  access_token: string;
  refresh_token?: string;
  expires_in?: string;
  scope?: string;
}

export interface PnAuthGuardServiceConfig {
  // auth service
  errorHandler?: (err) => any;
}
