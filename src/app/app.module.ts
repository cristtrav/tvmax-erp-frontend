import { NgModule, LOCALE_ID, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { MainComponent } from './main/main.component';
import { appInitializer } from './util/app.initializer';
import { SesionService } from './servicios/sesion.service';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzModalModule } from 'ng-zorro-antd/modal';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    NzBreadCrumbModule,
    NzAvatarModule,
    NzGridModule,
    NzDropDownModule,
    NzSpaceModule,
    NzNotificationModule,
    NzModalModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: es_ES },
    { provide: LOCALE_ID, useValue: 'es-PY' },
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [SesionService] }
  ],
  bootstrap: [MainComponent]
})
export class AppModule { }
