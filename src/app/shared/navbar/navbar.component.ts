import { Component, Output, EventEmitter, OnDestroy, OnInit, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { LayoutService } from '@shared/services/layout.service';
import { ConfigService } from '@shared/services/config.service';
import { MeService } from '@api';
import { CurrentUserDTO } from '@model';
import { AuthService } from '@app/core/auth/auth.service';
import {PnStorageService} from "@postnerd-core";
import {json} from "ngx-custom-validators/src/app/json/validator";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  placement = 'bottom-right';
  logoUrl = 'assets/img/logos/logo.png';
  menuPosition = 'Side';
  isSmallScreen = false;
  protected innerWidth: any;
  transparentBGClass = '';
  hideSidebar = true;
  public isCollapsed = true;
  layoutSub: Subscription;
  configSub: Subscription;
  userData: Partial<CurrentUserDTO> = {};

  @Output()
  toggleHideSidebar = new EventEmitter<Object>();


  public config: any = {};

  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private meService: MeService,
    private authService: AuthService,
    protected pnStorageService: PnStorageService,
  ) {

    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;

    this.layoutSub = layoutService.toggleSidebar$.subscribe(
      isShow => {
        this.hideSidebar = !isShow;
      });

  }

  ngOnInit() {
    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
    this.getMe();
  }

  ngAfterViewInit() {

    this.configSub = this.configService.templateConf$.subscribe((templateConf) => {
      if (templateConf) {
        this.config = templateConf;
      }
      this.loadLayout();
      this.cdr.markForCheck();

    });
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  loadLayout() {

    if (this.config.layout.menuPosition && this.config.layout.menuPosition.toString().trim() !== '') {
      this.menuPosition = this.config.layout.menuPosition;
    }

    if (this.config.layout.variant === 'Light') {
      this.logoUrl = 'assets/img/logos/logo.png';
    } else {
      this.logoUrl = 'assets/img/logos/logo.png';
    }

    if (this.config.layout.variant === 'Transparent') {
      this.transparentBGClass = this.config.layout.sidebar.backgroundColor;
    } else {
      this.transparentBGClass = '';
    }

  }

  toggleSidebar() {
    this.layoutService.toggleSidebarSmallScreen(this.hideSidebar);
  }

  logout() {
    this.authService.logout();
  }

  private getMe() {
    this.meService.meGet$()
      .subscribe(data => {
        // console.log('data', data);
        this.pnStorageService.setItemPersistent('userRolePermission', JSON.stringify(data.userRolePermissions));
        this.userData = data;
      });
  }
}
