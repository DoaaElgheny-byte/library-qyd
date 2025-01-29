import {
  NgModule,
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './modules/auth/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { WebApiService } from './services/webApi.service';
import { ConfirmationDialogService } from './modules/SharedComponent/SharedComponent/confirmation-dialog/confirmation-dialog.service';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { AuthInterceptor } from './modules/auth/interceptors/auth.interceptor';
// import { FileManagerModule } from '@syncfusion/ej2-angular-filemanager';

initializeApp(environment.firebase);
function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      //@ts-ignore
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    ClipboardModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    // FileManagerModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({ timeOut: 2000, preventDuplicates: true }),
  ],
  providers: [
    WebApiService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    ConfirmationDialogService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
