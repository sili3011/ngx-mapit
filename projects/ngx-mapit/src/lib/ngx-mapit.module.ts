import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapitComponent } from './ngx-mapit.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [NgxMapitComponent],
  imports: [BrowserModule, GoogleMapsModule, HttpClientModule],
  exports: [NgxMapitComponent],
})
export class NgxMapitModule {}
