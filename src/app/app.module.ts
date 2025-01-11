import { NgModule} from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';

import {
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';

import { WINDOW_PROVIDERS } from './shared/services/window.service';
import { windowToken, getWindow } from '@shared/window';
import { ContentLayoutComponent } from '@layouts/content/content-layout.component';
import { AuthLayoutComponent } from '@layouts/auth-layout/auth-layout.component';
import { ContentWithSidebarComponent } from '@layouts/content-with-sidebar/content-with-sidebar.component';

import { AuthService } from '@app/core/auth/auth.service';
import { CoreModule } from '@app/core/core.module';
import { AuthGuard } from '@app/core/auth/auth.guard';
import { ApiModule } from './api/api.module';
import {PermissionGuard} from "@app/core/guard/permission.guard";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: false
};

@NgModule({
  declarations: [
    AppComponent,
    ContentLayoutComponent,
    AuthLayoutComponent,
    ContentWithSidebarComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,
    AngularFireAuthModule,
    NgbModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      // disableTimeOut: true,
      // timeOut: 1000000000,
      autoDismiss: false,
      closeButton: true
    }),
    PerfectScrollbarModule,
    CoreModule,
    ApiModule,
  ],
  providers: [
    AuthService,
    AuthGuard,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    WINDOW_PROVIDERS,
    { provide: windowToken, useFactory: getWindow },
    NgbActiveModal,
    PermissionGuard,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
