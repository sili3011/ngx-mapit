import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapitComponent } from './ngx-mapit.component';

@NgModule({
  declarations: [NgxMapitComponent],
  imports: [BrowserModule, GoogleMapsModule],
  exports: [NgxMapitComponent],
})
export class NgxMapitModule {}
