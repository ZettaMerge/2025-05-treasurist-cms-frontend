import { Observable, Subscription } from 'rxjs';
import { Popup } from './popup.component';

export interface Dialog {
  data: any;
  isAnimated: boolean;
  backdropAnimations?: any;
  cardAnimations?: any;
  result$: Observable<Popup>;
  dispose: () => void;
}
