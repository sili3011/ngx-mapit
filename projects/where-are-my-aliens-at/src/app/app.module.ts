import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxMapitModule } from 'ngx-mapit';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { InfoWindowContentComponent } from './components/info-window-content/info-window-content.component';

@NgModule({
  declarations: [AppComponent, InfoWindowContentComponent],
  imports: [BrowserModule, HttpClientModule, NgxMapitModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
