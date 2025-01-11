import { Component, OnInit, ElementRef, Inject, Renderer2, ViewChild, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import { CustomizerService } from '@shared/services/customizer.service';
import { ConfigService } from '@shared/services/config.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ContentLayoutComponent implements OnInit, OnDestroy {
  public config: any = {};
  layoutSub: Subscription;
  @ViewChild('content-wrapper') wrapper: ElementRef;


  constructor(
    private configService: ConfigService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private customizerService: CustomizerService
  ) {
    this.config = this.configService.templateConf;
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

    this.renderer.removeClass(this.document.body, 'layout-dark');
    this.renderer.removeClass(this.document.body, 'layout-transparent');

    this.renderer.removeClass(this.document.body, 'menu-expanded');
    this.renderer.removeClass(this.document.body, 'navbar-static');
    this.renderer.removeClass(this.document.body, 'menu-open');
    this.renderer.removeClass(this.document.body, 'vertical-layout');
    this.renderer.removeClass(this.document.body, 'navbar-sticky');
    this.renderer.removeClass(this.document.body, 'vertical-menu');
    this.renderer.removeClass(this.document.body, 'blank-page');

    // this.renderer.addClass(this.document.body, 'blank-page');
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
