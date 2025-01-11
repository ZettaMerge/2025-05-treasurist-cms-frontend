import { HttpErrorResponse } from '@angular/common/http';

export const errorTitle = `ระบบขัดข้อง`; // 'System Failure';
export const warningTitle = `กรุณาตรวจสอบ`; // 'Please Check';
export const infoTitle = `แจ้งเพื่อทราบ`; // 'Attention Please';
export const errorAgreeText = `ตกลง`; // 'OK';
export const errorColorVar = 'danger';

export interface PnApiError extends HttpErrorResponse {
  ignoreGlobalErrorAlert: () => void;
}
export interface PnApiErrorHandler {
  title?: string;
  message?: string;
  colorVar?: string;
  agreeText?: string;
}

export function errorHandler(err: PnApiError, isDevTest = false): PnApiErrorHandler {
  let message = '';
  try {
    // error message from json
    const error = JSON.parse(err.error);

    if (error.PopupErrors.length && error.PopupErrors[0].Code === 'ERR0000') {
      if (isDevTest) {
        message = err.error;
      } else {
        message = `โปรดลองอีกครั้ง หรือติดต่อผู้ดูแลระบบ`; // 'Please try again later or contact system admin';
      }
    } else {
      for (const fieldError of error.FieldErrors) {
        // enter new line will show in pre-wrap
        message += `- ${fieldError.Message}`;
      }
      for (const popupError of error.PopupErrors) {
        // enter new line will show in pre-wrap
        message += `- ${popupError.Message}`;
      }
    }
  } catch (e) {
    if (isDevTest) {
      message = err as any;
    } else {
      message = `โปรดลองอีกครั้ง หรือติดต่อผู้ดูแลระบบ`;
    }
  }

  return {
    message,
    title: errorTitle,
    agreeText: errorAgreeText,
    colorVar: errorColorVar,
  };
}

export function errorHandlerDebug(err: PnApiError, isDevTest = false): PnApiErrorHandler {
  return errorHandler(err, true);
}
