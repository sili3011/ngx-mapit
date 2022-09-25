import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MarkerData } from 'ngx-mapit';

import secrets from 'secrets.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public title = 'WhereAreMyMarkersAt';
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
  public example = '{"lat": 48, "lng": 16}, {"lat": 48, "lng": 16.5}';

  public textControl = new FormControl('');

  public data: MarkerData[] = [];

  constructor() {
    this.textControl.valueChanges.subscribe((changes: string | null) => {
      if (changes) {
        try {
          const convertedString = JSON.parse(`[${changes}]`);
          console.log(convertedString);
          this.data = convertedString;
        } catch (error) {
          console.log(error);
          console.error('Suppress invalid JSON error.');
        }
      } else {
        this.textControl.setValue('{}', { emitEvent: false });
        this.data = [];
      }
    });
  }
}
