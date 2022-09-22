import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapitModule } from 'ngx-mapit';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, NgxMapitModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
