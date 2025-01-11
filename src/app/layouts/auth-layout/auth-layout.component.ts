import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ConfigService } from '@shared/services/config.service';
import { CustomizerService } from '@shared/services/customizer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  public config: any = {};
  layoutSub: Subscription;
  @ViewChild('content-wrapper') wrapper: ElementRef;

  logoUrl = 'assets/img/logos/logo.png';

  constructor(
    private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private customizerService: CustomizerService
  ) {
    this.config = this.configService.templateConf;
    this.renderer.addClass(this.document.body, 'auth-page');
  }

  ngOnInit() {
    this.layoutSub = this.configService.templateConf$.subscribe((templateConf) => {
      if (templateConf) {
        this.config = templateConf;
      }
      this.loadLayout();
      this.cdr.markForCheck();
    });
  }

  loadLayout() {
    this.removeTransparentBGClasses();

    if (this.config.layout.variant === 'Light') {
      this.renderer.removeClass(this.document.body, 'layout-dark');
      this.renderer.removeClass(this.document.body, 'layout-transparent');
    } else if (this.config.layout.variant === 'Dark') {
      this.renderer.removeClass(this.document.body, 'layout-transparent');
      this.renderer.addClass(this.document.body, 'layout-dark');
    } else if (this.config.layout.variant === 'Transparent') {
      this.renderer.addClass(this.document.body, 'layout-dark');
      this.renderer.addClass(this.document.body, 'layout-transparent');
      this.renderer.addClass(this.document.body, this.config.layout.sidebar.backgroundColor);
    }

    this.renderer.removeClass(this.document.body, 'menu-expanded');
    this.renderer.removeClass(this.document.body, 'navbar-static');
    this.renderer.removeClass(this.document.body, 'menu-open');
    this.renderer.removeClass(this.document.body, 'vertical-layout');
    this.renderer.removeClass(this.document.body, 'navbar-sticky');
    this.renderer.removeClass(this.document.body, 'vertical-menu');

    this.renderer.addClass(this.document.body, 'blank-page');
  }

  removeTransparentBGClasses() {
    if (this.customizerService.transparent_colors) {
      this.customizerService.transparent_colors.forEach(_ => {
        this.renderer.removeClass(this.document.body, _.class);
      });
    }

    if (this.customizerService.transparent_colors_with_shade) {
      this.customizerService.transparent_colors_with_shade.forEach(_ => {
        this.renderer.removeClass(this.document.body, _.class);
      });
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.document.body, 'auth-page');
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }

}
