import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-mapit',
  templateUrl: './ngx-mapit.component.html',
  styleUrls: ['./ngx-mapit.component.scss'],
})
export class NgxMapitComponent implements OnInit {
  loadedMap = false;
  loadedUI = false;
  lat = 0;
  lng = 0;
  options: google.maps.MapOptions = {
    //mapId: secrets.MAP_ID,
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

  constructor() {}

  ngOnInit(): void {}
}
