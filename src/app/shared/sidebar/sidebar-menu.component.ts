import {
  Component, OnInit, ViewChild, OnDestroy,
  ElementRef, AfterViewInit, ChangeDetectorRef, HostListener
} from '@angular/core';
import {ROUTES} from './sidebar-menu-routes.config';

import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Subscription} from 'rxjs';
import {customAnimations} from '@shared/animations/custom-animations';
import {ConfigService} from '@shared/services/config.service';
import {LayoutService} from '@shared/services/layout.service';
import {CheckPermissionService} from '@api';
import {PnStorageService} from '@postnerd-core';
import * as _ from 'lodash';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar-menu.component.html',
  animations: customAnimations
})
export class SidebarMenuComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('toggleIcon') toggleIcon: ElementRef;
  public menuItems: any[];
  level = 0;
  logoUrl = 'assets/img/logo.png';
  public config: any = {};
  protected innerWidth: any;
  layoutSub: Subscription;
  configSub: Subscription;
  perfectScrollbarEnable = true;
  collapseSidebar = false;
  resizeTimeout;

  constructor(
    private router: Router,
    private layoutService: LayoutService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private checkPermissionService: CheckPermissionService,
    protected pnStorageService: PnStorageService,
  ) {
    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;
    this.isTouchDevice();
  }


  ngOnInit() {
    // this.menuItems = ROUTES;
    const initialize = async () => {
      this.setMenu();
    };
    initialize();

    // console.log('this.menuItems', this.menuItems);
  }

  async setMenu() {
    const userRolePermission = this.pnStorageService.getItemPersistent('userRolePermission');
    const jsonRole = JSON.parse(userRolePermission);

    const temp = [];
    this.menuItems = [];
    for (const item of ROUTES) {
      let result;
      if (item.submenu.length === 0) {
        // console.log('sub menu == 0');
        // if (item.permission) {
        result = await this.checkPermissionService.checkIsAllow(jsonRole, item.permission);
        // console.log('result', result);
        // console.log('itemss', item);
        if (result) {
          if (result.permission.name === item.permission && result.canView ||
            result.permission.name === item.permission && result.canCreate ||
            result.permission.name === item.permission && result.canExport) {
            item.isShow = true;
            temp.push(item);
          } else {
            item.isShow = false;
          }
        }
      } else {
        // console.log('item > 0', item);
        item.isShow = false;
        for (const submenu of item.submenu) {
          result = await this.checkPermissionService.checkIsAllow(jsonRole, submenu.permission);
          if (result) {
            if (result.permission.name === submenu.permission && result.canView ||
              result.permission.name === submenu.permission && result.canCreate ||
              result.permission.name === submenu.permission && result.canExport) {
              // console.log('resultSub', result);
              submenu.isShow = true;
              item.isShow = true;
              temp.push(item);
            } else {
              submenu.isShow = false;
              // item.isShow = false;
              // temp.push(item);
            }
          }
        }
      }

    }
    // console.log('temp', temp);
    const newTemp = _.uniqBy(temp, 'title');
    // console.log('newTemp', newTemp);
    this.menuItems = newTemp;

    // console.log('result', result);
    // console.log('temp', temp);
    // console.log('this.menuItems', this.menuItems);
  }

  ngAfterViewInit() {

    this.configSub = this.configService.templateConf$.subscribe((templateConf) => {
      if (templateConf) {
        this.config = templateConf;
      }
      this.loadLayout();
      this.cdr.markForCheck();

    });

    this.layoutSub = this.layoutService.overlaySidebarToggle$.subscribe(
      collapse => {
        if (this.config.layout.menuPosition === 'Side') {
          this.collapseSidebar = collapse;
        }
      });

  }


  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout((() => {
      this.innerWidth = event.target.innerWidth;
      this.loadLayout();
    }).bind(this), 500);
  }

  loadLayout() {
    this.menuItems = ROUTES;

    if (this.config.layout.sidebar.backgroundColor === 'white') {
      this.logoUrl = 'assets/img/logo-dark.png';
    } else {
      this.logoUrl = 'assets/img/logo.png';
    }

    if (this.config.layout.sidebar.collapsed) {
      this.collapseSidebar = true;
    } else {
      this.collapseSidebar = false;
    }
  }

  toggleSidebar() {
    const conf = this.config;
    conf.layout.sidebar.collapsed = !this.config.layout.sidebar.collapsed;
    this.configService.applyTemplateConfigChange({layout: conf.layout});

    setTimeout(() => {
      this.fireRefreshEventOnWindow();
    }, 300);
  }

  fireRefreshEventOnWindow = function () {
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('resize', true, false);
    window.dispatchEvent(evt);
  };

  CloseSidebar() {
    this.layoutService.toggleSidebarSmallScreen(false);
  }

  isTouchDevice() {

    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();

    if (isMobile || isTablet) {
      this.perfectScrollbarEnable = false;
    } else {
      this.perfectScrollbarEnable = true;
    }

  }


  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }

  }

}
