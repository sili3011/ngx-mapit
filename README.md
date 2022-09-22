# ngx-mapit

ngx-mapit provides an easy to use component to visualize big sets of data (at least 80.000+ entries) with GoogleMaps while maintaining a stable performance, even on mobile.

## Demo
[WhereAreMyAliensAt](https://sili3011.github.io/ngx-mapit/)

## How to use

### Installation

To add ngx-mapit library to your package.json use the following command.

```
npm install ngx-mapit --save
```
### Importing
You must import NgxMapitModule inside your main application module (usually named AppModule).

```
import { NgModule } from '@angular/core';
import { NgxMapitModule } from 'ngx-mapit';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [NgxMapitModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```
### Basic map setup
Add the component to the template of the component you want to use it in and provide it at least with your secrets which are your [GoogleMaps api key](https://developers.google.com/maps/documentation/javascript/get-api-key) and optionally the [map id](https://developers.google.com/maps/documentation/get-map-id) of a custom map you already configured.
```
<ngx-mapit
  [secrets]="secrets"
></ngx-mapit>
```
```
MapSecrets {
  API_KEY: string;
  MAP_ID?: string;
}
```
### Advanced map setup
You can fully customize the default GoogleMap behaviour by passing a [google.maps.MapOptions](https://developers.google.com/maps/documentation/javascript/reference/map#MapOptions) object to the ngx-mapit component `[options]="options"`. [Here](https://github.com/sili3011/ngx-mapit/blob/main/projects/where-are-my-aliens-at/src/app/app.component.ts) is an example.
### Markers setup
To visualize your data using markers you need to feed the data to the map component using the data directive. The data should be an array of type MarkerData. An id (preferrably unique for everything to work as intended), latitude (lat) and longitude (lng) are mandatory.
```
<ngx-mapit
  [secrets]="secrets"
  [data]="data"
></ngx-mapit>
```
```
MarkerData {
  id: string;
  lat: number;
  lng: number;
  title?: string;
  content?: any;
  wikiSearchString?: string;
}
```
For markers to be interactible add `[clickableMarkers]="true"`.
### Info window options
Currently you have the option to show a title as a header by providing the title in the MarkerData and enabling the title by setting `[showTitle]="true"`.

Additionally you can choose to either pass anything as content in the MarkerData object OR a wikiSearchString and enabling `[queryWikipedia]="true"` which will show a neatly formatted result of your wikipedia search.
### Places search
In order for places to work you first need to enable the [API](https://developers.google.com/maps/documentation/javascript/places) in your GoogleCloud.

After that you can add an InputElement to your HTML and pass it to the ngx-mapit component and enable places search.
```
<input #searchInput type="text" class="searchInput" />
<ngx-mapit
  [secrets]="secrets"
  [data]="data"
  [usePlaces]="true"
  [placesInput]="searchInput"
></ngx-mapit>
```
## Overview
```
  // minimum is 1
  @Input()
  minmumDistance = 1;
  @Input()
  // maximum is 19
  maximumDistance = 19;
  // starting latitude
  @Input()
  lat = 0;
  // starting longitude
  @Input()
  lng = 0;
  // google maps configuration
  // map id and placement of default UI
  @Input()
  options: google.maps.MapOptions = {};
  // secrets
  // API_KEY is MANDATORY
  // MAP_ID is optional
  @Input()
  secrets!: MapSecrets;
  // data markers should be created for
  @Input()
  data: any[] = [];
  // input element that should be used for searching places
  @Input()
  placesInput?: HTMLInputElement;

  // FLAGS
  // wether or not to enable PLACES API for address search
  // NEEDS TO BE ENABLED IN USERS GCLOUD
  @Input()
  usePlaces = false;
  // wether or not markers should be clickable aka disable info windows
  @Input()
  clickableMarkers = false;
  // wether or not to show the markers wikipedia page in its info window
  @Input()
  queryWikipedia = false;
  // wether or not to show the markers title in its info window
  @Input()
  showTitle = true;
  // ask user for permission and use their location at initialization
  // ONLY WORKS ON DESKTOP
  @Input()
  startAtUserLocation = true;
```
## Roadmap
- Add another example
- Support more dynamic info windows
- Expand info windows
- Use [markdown](https://www.npmjs.com/package/ngx-markdown) in info window

## Support Development
The use of this library is totally free and no donation is required.

As the owner and primary maintainer of this project, I am putting a lot of time and effort beside my job, my family and my private time to bring the best support I can by answering questions, addressing issues and improving the library to provide more and more features over time.

If this project has been useful, that it helped you or your business to save precious time, don't hesitate to give it a star and to consider a donation to support its maintenance and future development.
