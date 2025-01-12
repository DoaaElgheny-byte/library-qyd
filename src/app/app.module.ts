import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormModelComponent } from 'src/shared/form-model/form-model.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModelComponent } from 'src/shared/table-model/table-model.component';
import { ButtonModelComponent } from 'src/shared/button-model/button-model.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormModelComponent,
    FormsModule,
    ReactiveFormsModule,
    TableModelComponent,
    ButtonModelComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
