import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { MarkerData } from 'projects/ngx-mapit/src/public-api';

import secrets from 'secrets.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  public title = 'WhereAreMyAliensAt';
  public secrets = secrets;
  public options: google.maps.MapOptions = {
    mapId: secrets.MAP_ID,
    backgroundColor: '#30303030',
    mapTypeControl: true,
    mapTypeControlOptions: {
      style: 1,
      position: 9,
    },
    streetViewControl: false,
    zoomControlOptions: {
      position: 6,
    },
  };

  data: MarkerData[] = [];

  constructor(private _http: HttpClient, private _csvParser: Papa) {}

  public ngOnInit(): void {
    this._http
      .get('assets/aliens.csv', { responseType: 'blob' })
      .subscribe((file) => {
        this._csvParser.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (result) => {
            this.data = result.data.map((d: any) => ({
              id: `${d.datetime}${d.latitude}${d.longitude}`.replace(' ', '_'),
              lat: d.latitude,
              lng: d.longitude,
              title: `${d.datetime}${d.latitude}${d.longitude}`.replace(
                ' ',
                '_'
              ),
              content: d,
              wikiSearchString: 'aliens',
            }));
          },
        });
      });
  }
}
