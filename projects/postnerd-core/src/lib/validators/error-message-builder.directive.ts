import { Self, OnInit, OnDestroy, Inject, ComponentRef, ViewContainerRef, ComponentFactoryResolver, Directive, Renderer2, AfterViewInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { InjectionToken } from '@angular/core';
import { ErrorMessageControlComponent } from './error-message-control.component';

export const defaultErrors = {
  required: (error) => `โปรดระบุข้อมูลให้ครบถ้วน`, // โปรดระบุข้อมูลให้ครบถ้วน // Please fill in the required fields
  minlength: ({ requiredLength, actualLength }) => `โปรดระบุอย่างน้อย ${requiredLength} ตัวอักษร`,  // โปรดระบุอย่างน้อย ${x} ตัวอักษร // Please fill atleast ${x} characters
  vEmail: (error) => `อีเมลไม่ถูกต้อง`, // อีเมลไม่ถูกต้อง // Invalid email address
  vLink: (error) => `รูปแบบลิงก์ไม่ถูกต้อง`, // ลิงก์ไม่ถูกต้อง // Invalid Link
  vPassword: (error) => `ต้องกำหนดรหัสผ่านขั้นต่ำ 8 ตัวอักษร ประกอบด้วย ตัวอักษรพิมพ์ใหญ่ ตัวอักษรพิมพ์เล็ก และตัวเลข`,
  vEqualTo: ({ targetValue, targetName }) => {
    return targetName ? `โปรดระบุให้เหมือน ${targetName}` : `โปรดระบุเท่ากับ ${targetValue}`;
    // โปรดระบุให้เหมือน : โปรดระบุเท่ากับ
    // Please fill same as ${x} : Please fill equal to ${x}
  },
  vMinMax: ({ min, max }) => {
    if (min != null && max != null) {
      return `โปรดระบุระหว่าง ${min} - ${max}`; // โปรดระบุระหว่าง // Please fill between
    } else if (min != null) {
      return `โปรดระบุอย่างน้อย ${min}`; // โปรดระบุอย่างน้อย // Please fill atlest
    } else {
      return `โปรดระบุอย่างมาก ${max}`; // โปรดระบุอย่างมาก // Please fill atmost
    }
  },
  vString: (error) => {
    const comboMessages: string[] = [];
    if (error.vEng) {
      comboMessages.push(`ตัวอักษรภาษาอังกฤษ`); // ตัวอักษรภาษาอังกฤษ // English characters
    }
    if (error.vThai) {
      comboMessages.push(`ตัวอักษรภาษาไทย`); // ตัวอักษรภาษาไทย // Thai characters
    }
    if (error.vDigit) {
      if (error.vDigit === true) {
        comboMessages.push(`ตัวเลข`); // ตัวเลข // digit
      } else {
        comboMessages.push(`${error.vDigit} ${error.vDigit > 1 ? `หลัก` : `หลัก`}`); // หลัก // digits // digit
      }
    }
    if (error.vSpecial) {
      if (error.vSpecial === true) {
        comboMessages.push(`อักขระพิเศษ`); // อักขระพิเศษ // special characters
      } else if (Array.isArray(error.vSpecial.vSpecial)) {
        comboMessages.push(`อักขระ` + ` ${error.vSpecial.join(' ')}`); // อักขระ // characters
      } else {
        comboMessages.push(`อักขระ` + ` ${error.vSpecial}`); // อักขระ // character
      }
    }
    if (comboMessages.length > 1) {
      comboMessages[comboMessages.length - 1] = `หรือ` + ` ${comboMessages[comboMessages.length - 1]}`; // หรือ // or
    }

    return `โปรดระบุเพียง` + comboMessages.join(' '); // โปรดระบุเพียง // Kindly identify
  },
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => {
    return defaultErrors;
  },
});



@Directive({
  selector: `
    [ngModel][required]:not(ng-select):not(input[type="time"]),
    [ngModel][minlength],
    [ngModel][vMin],
    [ngModel][vMax],
    [ngModel][vThai],
    [ngModel][vEng],
    [ngModel][vDigit],
    [ngModel][vSpecial],
    [ngModel][vEmail],
    [ngModel][vLink],
    [ngModel][vPassword]
  `,
})
export class ErrorMessageBuilderDirective implements OnInit, OnDestroy, AfterViewInit {

  private componentRef: ComponentRef<ErrorMessageControlComponent>;
  private sub: Subscription;

  constructor(
    @Self() private control: NgControl,
    @Inject(FORM_ERRORS) private errors,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private renderer: Renderer2,
  ) { }

  ngOnInit() {
    this.sub = this.control.valueChanges
      .subscribe(() => {
        this.getErrorText();
      });
  }

  ngAfterViewInit(): void {
    // this.getErrorText();
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  getErrorText() {
    const error = this.control.errors;
    if (error) {
      const firstKey = Object.keys(error)[0];
      const getError = this.errors[firstKey];
      if (getError) {
        const text = getError(error[firstKey]);
        this.setError(text);
      }
    } else {
      this.setError(null);
    }
  }

  setError(text: string) {
    if (text) {
      if (!this.componentRef) {
        this.componentRef = this.viewContainerRef.createComponent(
          this.componentFactoryResolver.resolveComponentFactory(ErrorMessageControlComponent),
        );
        this.renderer.addClass(this.componentRef.location.nativeElement, 'error-message-control');
        // this.renderer.addClass(this.componentRef.location.nativeElement, 'error-message-tooltip');
      }
      this.componentRef.instance.text = text;
    } else {
      if (this.componentRef) {
        this.componentRef.destroy();
        this.componentRef = null;
      }
    }
  }

}
