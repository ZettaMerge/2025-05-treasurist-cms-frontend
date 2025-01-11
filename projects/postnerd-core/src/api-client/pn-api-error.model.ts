import { HttpErrorResponse } from '@angular/common/http';

export interface ApiError extends HttpErrorResponse {
  ignoreGlobalErrorAlert: () => void;
}

export interface ApiErrorHandler {
  title?: string;
  message?: string;
  colorVar?: string;
  agreeText?: string;
}
