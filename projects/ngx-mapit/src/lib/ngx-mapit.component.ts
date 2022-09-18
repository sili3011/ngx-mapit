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
  private isMobile = false;

  public loadedMap = false;

  @Input()
  lat = 0;
  @Input()
  lng = 0;
  @Input()
  options: google.maps.MapOptions = {};
  @Input()
  secrets: any = {};
  @Input()
  data: any[] = [];
  @Input()
  usePlaces = false;
  @Input()
  clickableMarkers = false;
  @Input()
  queryWikipedia = false;

  @ViewChild(GoogleMap) map!: GoogleMap;

  private infoWindows: Map<string, google.maps.InfoWindow> = new Map();
  private manager!: MarkerManager;

  private WIKIPEDIA_API_URL = 'https://en.wikipedia.org/api/rest_v1/page/html/';

  constructor(private cd: ChangeDetectorRef, private http: HttpClient) {}

  public ngOnInit(): void {
    this.isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(
        navigator.userAgent
      );

    if (!this.isMobile) {
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
      apiKey: this.secrets.GMAP_API_KEY,
      version: 'weekly',
      libraries: libraries,
    })
      .load()
      .then(() => {
        this.loadedMap = true;
        this.cd.detectChanges();
        this.manager = new MarkerManager(this.map.googleMap!, {});
        if (this.data.length) {
          this.setMarkers();
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
      this.setMarkers();
    }
  }

  private setMarkers(): void {
    this.manager.clearMarkers();

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

    this.manager.addMarkers(
      markersWithContent.map((m) => m.marker),
      1,
      19
    );
    this.manager.refresh();
  }

  private _clickedMarker(
    marker: google.maps.Marker,
    content?: HTMLElement,
    wikiSearchString?: string
  ): void {
    const id = marker.getTitle();
    console.log(id);
    if (id) {
      if (this.infoWindows.has(id)) {
        this.infoWindows.get(id)?.close();
        this.infoWindows.delete(id);
      } else {
        if (this.queryWikipedia && wikiSearchString) {
          this.http
            .get(this.WIKIPEDIA_API_URL + id.replace(' ', '_'), {
              responseType: 'text',
            })
            .subscribe({
              next: (resp: string) => {
                //this.fillInfoWindow(resp, marker, id);
              },
            });
        }
        const infoWinodw = new google.maps.InfoWindow({
          position: marker.getPosition(),
          content: content,
          pixelOffset: new google.maps.Size(0, -32),
        });
        infoWinodw.open(this.map.googleMap);
        this.infoWindows.set(id, infoWinodw);
      }
    }
  }
}
