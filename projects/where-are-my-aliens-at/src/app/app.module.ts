import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapitModule } from 'ngx-mapit';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxMapitModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
