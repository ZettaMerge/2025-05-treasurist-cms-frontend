import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Popup, PopupComponent, PopupModel, PopupType } from './popup.component';
import { PopupConfig, defaultConfig } from './popup.config';
import { userPopupConfigToken } from './user-config.token';
import { DialogService } from './dialog.service';

@Injectable({
  providedIn: 'root',
})
export class PopupService {

  config = {} as PopupConfig;

  constructor(
    private dialogService: DialogService,
    @Inject(userPopupConfigToken) userConfig: PopupConfig) {

    this.config = Object.assign({}, defaultConfig, userConfig);
  }

  alert(title: string, message = '', colorVar?: string,
    agreeText?: string,
  ): Observable<Popup | null> {

    colorVar = colorVar || this.config.alertColorVar;
    agreeText = agreeText || this.config.alertAgreeText;

    return this.dialogService.addDialog<PopupModel>(PopupComponent, {
      type: PopupType.Alert,
      title,
      message,
      colorVar,
      agreeText,
      disagreeText: '',
      isAgreeFirst: true,
    }, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }

  confirm(
    title: string, message = '', colorVar?: string,
    agreeText?: string, disagreeText?: string, isAgreeFirst?: boolean,
  ): Observable<Popup | null> {

    colorVar = colorVar || this.config.confirmColorVar;
    agreeText = agreeText || this.config.agreeText;
    disagreeText = disagreeText || this.config.disagreeText;
    isAgreeFirst = isAgreeFirst !== undefined ? isAgreeFirst : this.config.isAgreeFirst;

    return this.dialogService.addDialog<PopupModel>(PopupComponent, {
      type: PopupType.Confirm,
      title,
      message,
      colorVar,
      agreeText,
      disagreeText,
      isAgreeFirst,
    }, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }

  confirmDelete(
    itemName: string, title?: string, message?: string, colorVar?: string,
    agreeText?: string, disagreeText?: string, isAgreeFirst?: boolean,
  ): Observable<Popup | null> {
    title = title || (this.config.deleteTitleFunc && this.config.deleteTitleFunc(itemName));
    message = message || (this.config.deleteMessageFunc && this.config.deleteMessageFunc(itemName));
    colorVar = colorVar || this.config.deleteColorVar;
    agreeText = agreeText || this.config.agreeText;
    disagreeText = disagreeText || this.config.disagreeText;
    isAgreeFirst = isAgreeFirst !== undefined ? isAgreeFirst : this.config.isAgreeFirst;

    return this.dialogService.addDialog<PopupModel>(PopupComponent, {
      type: PopupType.Confirm,
      title,
      message,
      colorVar,
      agreeText,
      disagreeText,
      isAgreeFirst,
    }, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }

  custom(component: any, data: any): Observable<Popup | null> {
    return this.dialogService.addDialog(component, data, {
      isAnimated: this.config.isAnimated,
      backdropAnimations: this.config.backdropAnimations,
      cardAnimations: this.config.cardAnimations,
    });
  }
}
