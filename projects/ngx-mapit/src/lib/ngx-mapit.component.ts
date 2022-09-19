import { HttpClient } from '@angular/common/http';
import { OnChanges, SimpleChanges } from '@angular/core';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Libraries, Loader } from '@googlemaps/js-api-loader';
import { MarkerManager } from '@googlemaps/markermanager';

export interface MapSecrets {
  API_KEY: string;
  MAP_ID?: string;
}

export interface MarkerData {
  lat: number;
  lng: number;
  title: string;
  content?: HTMLElement;
  wikiSearchString?: string;
}

@Component({
  selector: 'ngx-mapit',
  templateUrl: './ngx-mapit.component.html',
  styleUrls: ['./ngx-mapit.component.scss'],
})
export class NgxMapitComponent implements OnInit, OnChanges {
  private _isMobile = false;

  public loadedMap = false;

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

  // FLAGS
  // wether or not enable PLACES API for address search
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

  @ViewChild(GoogleMap) map!: GoogleMap;

  private _infoWindows: Map<string, google.maps.InfoWindow> = new Map();
  private _manager!: MarkerManager;

  private WIKIPEDIA_URL = 'https://en.wikipedia.org/wiki/';
  private WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/html/';

  constructor(private _cd: ChangeDetectorRef, private _http: HttpClient) {}

  public ngOnInit(): void {
    this._isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        navigator.userAgent
      );

    if (this.startAtUserLocation && !this._isMobile) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }

    const libraries: Libraries | undefined = [];

    if (this.usePlaces) {
      libraries.push('places');
    }

    new Loader({
      apiKey: this.secrets.API_KEY,
      version: 'weekly',
      libraries: libraries,
    })
      .load()
      .then(() => {
        this.loadedMap = true;
        this._cd.detectChanges();
        this._manager = new MarkerManager(this.map.googleMap!, {});
        if (this.data.length) {
          this._setMarkers();
        }
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes['data']?.currentValue;
    if (
      this.loadedMap &&
      currentValue.length &&
      JSON.stringify(currentValue) !==
        JSON.stringify(changes['data']?.previousValue)
    ) {
      this._setMarkers();
    }
  }

  private _setMarkers(): void {
    this._manager.clearMarkers();

    const markersWithContent = this.data.map((data: any) => ({
      marker: new google.maps.Marker({
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.title,
        clickable: this.clickableMarkers,
      }),
      content: data.content,
      wikiSearchString: data.wikiSearchString,
    }));

    if (this.clickableMarkers) {
      markersWithContent.forEach((marker) =>
        window.google.maps.event.addListener(marker.marker, 'click', () =>
          this._clickedMarker(
            marker.marker,
            marker.content,
            marker.wikiSearchString
          )
        )
      );
    }

    this._manager.addMarkers(
      markersWithContent.map((m) => m.marker),
      1,
      19
    );
    this._manager.refresh();
  }

  private _clickedMarker(
    marker: google.maps.Marker,
    content?: HTMLElement,
    wikiSearchString?: string
  ): void {
    const id = marker.getTitle();
    console.log(id);
    if (id) {
      if (this._infoWindows.has(id)) {
        this._infoWindows.get(id)?.close();
        this._infoWindows.delete(id);
      } else {
        if (this.queryWikipedia && wikiSearchString) {
          this._http
            .get(this.WIKIPEDIA_API_URL + wikiSearchString.replace(' ', '_'), {
              responseType: 'text',
            })
            .subscribe({
              next: (resp: string) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(resp, 'text/html');
                doc.body.querySelectorAll('a[href^="./"]').forEach((href) => {
                  href.addEventListener('click', (event) => {
                    event.preventDefault();
                    window.open(
                      this.WIKIPEDIA_URL +
                        href.getAttribute('href')?.replace('./', ''),
                      '_blank'
                    );
                  });
                });
                doc.body.classList.add('body-window');
                this._fillInfoWindow(marker, id, resp);
              },
              error: () => {
                const content = `<div>No wikipedia entry found for ${marker.getTitle()}</div>`;
                this._fillInfoWindow(marker, id, content);
              },
            });
        } else {
          this._fillInfoWindow(marker, id, content?.outerHTML);
        }
      }
    }
  }

  private _fillInfoWindow(
    marker: google.maps.Marker,
    id: string,
    content?: string
  ): void {
    if (this.showTitle) {
      content = `<h1>${marker.getTitle()}</h1>` + content;
    }
    const infoWinodw = new google.maps.InfoWindow({
      position: marker.getPosition(),
      content: content,
      pixelOffset: new google.maps.Size(0, -32),
    });
    infoWinodw.open(this.map.googleMap);
    this._infoWindows.set(id, infoWinodw);
  }
}
