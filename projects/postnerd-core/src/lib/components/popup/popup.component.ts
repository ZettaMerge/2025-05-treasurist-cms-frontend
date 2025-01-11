import { Component } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Dialog } from './dialog.interface';
import { trigger, state, style, animate, transition, AnimationEvent } from '@angular/animations';

export interface PopupModel {
  title: string;
  message: string;
  colorVar: string;
  type: PopupType;
  agreeText: string;
  disagreeText: string;
  isAgreeFirst: boolean;
}

export enum PopupType {
  Alert = 1,
  Confirm = 2,
}

export interface Popup {
  actionSub: Subscription;
  loading: () => void;
  close: () => void;
}

export interface PopupAnimationModel {
  isAnimated: boolean;
  backdropAnimations: any;
  cardAnimations: any;
}

export const popupAnimations = [
  trigger('backdrop', [
    state('void', style({ opacity: '{{ voidOpacity }}' }), { params: { voidOpacity: 0 } }),
    state('open', style({ opacity: '{{ openOpacity }}' }), { params: { openOpacity: 1 } }),
    state('closed', style({ opacity: '{{ closedOpacity }}' }), { params: { closedOpacity: 0 } }),
    transition('void => open', animate('{{ openAnimate }}'), { params: { openAnimate: '250ms linear' } }),
    transition('open => closed', animate('{{ closedAnimate }}'), { params: { closedAnimate: '200ms linear' } }),
  ]),
  trigger('card', [
    state('void', style({ opacity: '{{ voidOpacity }}', transform: '{{ voidTransform }}' }), { params: { voidOpacity: 1, voidTransform: 'translateY(-30%)' } }),
    state('open', style({ opacity: '{{ openOpacity }}', transform: '{{ openTransform }}' }), { params: { openOpacity: 1, openTransform: 'translateY(0)' } }),
    state('closed', style({ opacity: '{{ closedOpacity }}', transform: '{{ closedTransform }}' }), { params: { closedOpacity: 0, closedTransform: 'translateY(-30%)' } }),
    transition('void => open', animate('{{ openAnimate }}'), { params: { openAnimate: '300ms ease-out' } }),
    transition('open => closed', animate('{{ closedAnimate }}'), { params: { closedAnimate: '150ms ease-in-out' } }),
  ]),
];

@Component({
  selector: 'lib-popup',
  template: `
    <div
      [@.disabled]="!isAnimated"
      class="modal has-no-footer is-small is-{{ data.colorVar }} is-active popup-confirm">
      <div
        class="modal-background"
        [@backdrop]="{ value: animationState, params: backdropAnimations }"
        (@backdrop.done)="onBackdropAnimationDone($event)"
        (click)="data.type == PopupType.Confirm && !isLoading && onDismiss()"></div>
      <div
        class="modal-card"
        style="width: 350px;"
        [@card]="{ value: animationState, params: cardAnimations }"
        (@card.done)="onCardAnimationdropDone($event)">
        <div class="modal-header align-items-center">
          <h4 class="modal-title">
            {{ data.title }}
          </h4>
          <!-- <button
            *ngIf="data.type == PopupType.Confirm"
            type="button"
            class="close"
            aria-label="Close"
            (click)="onDismiss()"
            [style.pointer-events]="closeButtonPointerEvents()">
            <span aria-hidden="true">&times;</span>
          </button> -->
        </div>
        <section class="modal-card-body text-center">
          <div class="block my-3" *ngIf="data.message">
            <span class="is-pre-wrap text-weight-bold">{{ data.message }}</span>
          </div>
        </section>
        <div
          class="modal-footer"
          *ngIf="data.type == PopupType.Alert">
          <button
            class="button is-fat is-{{ data.colorVar }}"
            [class.is-loading]="isLoading"
            (click)="onConfirm()">{{ data.agreeText }}</button>
        </div>
        <div
          class="modal-footer"
          *ngIf="data.type == PopupType.Confirm">
          <button
            class="button is-fat btn btn-{{ data.colorVar }}"
            [class.is-loading]="isLoading"
            (click)="onConfirm()">{{ data.agreeText }}</button>
          <button
            class="button is-fat is-light btn btn-outline-secondary"
            [disabled]="isLoading"
            (click)="onDismiss()">{{ data.disagreeText }}</button>
        </div>
      </div>
    </div>
  `,
  animations: popupAnimations,
})
export class PopupComponent implements Dialog {

  PopupType = PopupType;

  data: PopupModel;
  isLoading: boolean;
  hasAnimation = true;
  dispose: () => void;

  isAnimated: boolean;
  backdropAnimations: any;
  cardAnimations: any;
  animationState: 'open' | 'closed' | 'void' = 'open';
  private isBackdropAnimationDone = false;
  private isCardAnimationDone = false;

  protected result = new Subject<Popup>();
  result$ = this.result.asObservable();

  constructor() {
  }

  onConfirm() {
    if (this.result.observers.length > 0) {
      this.result.next(
        {
          set actionSub(actionSub: Subscription) {
            this.loading();
            actionSub.add(() => {
              this.close();
            });
          },
          loading: () => {
            this.isLoading = true;
          },
          close: () => {
            this.close();
          }
        }
      );
      this.result.complete();

      // auto close if does not show loading
      if (!this.isLoading) {
        this.close();
      }
    } else {
      // auto close if does not subscribe
      this.close();
    }
  }

  onDismiss() {
    this.result.next(null);
    this.result.complete();
    this.close();
  }

  closeButtonPointerEvents() {
    return this.isLoading ? 'none' : 'inherit';
  }

  onBackdropAnimationDone(event: AnimationEvent) {
    if (event.fromState === 'open' && event.toState === 'closed') {
      this.isBackdropAnimationDone = true;
      this.allAnimationDone();
    }
  }

  onCardAnimationdropDone(event: AnimationEvent) {
    if (event.fromState === 'open' && event.toState === 'closed') {
      this.isCardAnimationDone = true;
      this.allAnimationDone();
    }
  }

  private close() {
    this.animationState = 'closed';
    if (!this.isAnimated || !this.hasAnimation) {
      this.dispose();
    }
  }

  private allAnimationDone() {
    if (this.isBackdropAnimationDone && this.isCardAnimationDone) {
      this.dispose();
    }
  }
}
