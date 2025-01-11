export interface PopupConfig {
  // general
  isAgreeFirst?: boolean;
  agreeText?: string;
  disagreeText?: string;
  // alert
  alertAgreeText?: string;
  alertColorVar?: string;
  // confirm
  confirmColorVar?: string;
  // delete
  deleteTitleFunc?: (itemName: string) => string;
  deleteMessageFunc?: (itemName: string) => string;
  deleteColorVar?: string;
  // animations
  isAnimated?: boolean;
  backdropAnimations?: {
    voidOpacity?: number;
    openOpacity?: number;
    closedOpacity?: number;
    openAnimate?: string;
    closedAnimate?: string;
  };
  cardAnimations?: {
    voidOpacity?: number;
    voidTransform?: string;
    openOpacity?: number;
    openTransform?: string;
    closedOpacity?: number;
    closedTransform?: string;
    openAnimate?: string;
    closedAnimate?: string;
  };
}

export const defaultConfig = {
  // general
  isAgreeFirst: true,
  agreeText: 'Yes',
  disagreeText: 'No',
  // alert
  alertAgreeText: 'OK',
  alertColorVar: 'primary',
  // confirm
  confirmColorVar: 'primary',
  // delete
  deleteTitleFunc: (itemName: string) => {
    return `ยืนยันการลบ`;
  },
  deleteMessageFunc: (itemName: string) => {
    return `คุณต้องการที่จะลบ "${itemName}" หรือไม่?`;
  },
  deleteColorVar: 'danger',
  isAnimated: true,
};
