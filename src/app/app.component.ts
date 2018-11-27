import { Component, OnInit } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { DpState } from './store'
import { Constants } from './constants';
import { DistanceUnitService } from './distance-unit.service';
import '../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';

declare let L; // leaflet instance (map)

@Component({
  selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {

  //map pins
  point1;
  point2;

  //redux
  store;

  distanceBetween;
  originalPins = [];
  mydistance = 0;



  constructor(
    private ngRedux: NgRedux<DpState>,
    private distanceUnitService: DistanceUnitService
   ) {
    ngRedux.subscribe( () => {
     this.store = ngRedux.getState();
     this.mydistance = this.store.distance;
    });
  }

	ngOnInit() {
		const map = L.map( 'map' ).setView( [ Constants.MAPINITIALVIEWLATITUDE ,Constants.MAPINITIALVIEWLONGITUDE ], 10 );
    this.sendMessage('kilometers');

    L.tileLayer(`${Constants.MAPAPI}{id}/{z}/{x}/{y}.png?access_token={accessToken}`, {
      maxZoom: Constants.MAXMAPZOOM,
      id: Constants.MAPID,
      accessToken: Constants.ACCESSTOKEN
    }).addTo( map );

    // get map pins from the json file
    this.getPins( map, this.originalPins );

  }

  // angular service
  sendPointA = (pointA) => this.distanceUnitService.sendPointA( pointA );
  sendPointB = (pointB) => this.distanceUnitService.sendPointB( pointB );
  sendMessage = (measure) => this.distanceUnitService.sendMessage( measure );
  clearAddress = () => this.distanceUnitService.setClearMessage('');

  getPins = ( map, originalPins ) => {
    let pins;
    let draggedPinLat;
    let draggedPinLong;
    let notMovingPinLat;
    let notMovingPinLong;
    let pointAString;
    let pointBString;
    let self = this;

    fetch( Constants.PINSURL )
      .then( response => response.json() )
      .then(( p ) => {

      // Draw the fetched pins

      pins = p;

      p.map( ( pin ) => {
        let pinLatLong = `{ "lat":${ pin.lat }, "long":${ pin.long } }`;
         originalPins.push( pinLatLong );
         drawPin( pin, map );
      })

      //draw pins on the map
      function drawPin( pin, map ) {
        let allMarkers = self.getMapMarkers(map);
        let iconToUser = pin.id === 'pin1' ? 'blue_marker.png' : 'red_marker.png';


        let myIcon = L.icon({
          iconUrl: `../assets/leaflet/images/${ iconToUser }`,
          iconSize: [ 30, 50 ],
          iconAnchor: [ 22, 49 ],
          popupAnchor: [ -3, -76 ],
          shadowUrl: '../assets/leaflet/images/marker-shadow.png',
          shadowSize: [ 50, 60 ],
          shadowAnchor: [ 4, 62 ]
        });

        let { lat: lat, long: long, title: title, id: id } = pin;
        id = L.marker( [ lat, long ],{ draggable: true, icon: myIcon } ).addTo( map );
        id.bindTooltip( `<b>${ title }</b>` ).openTooltip();

        // get the markers on the map to pass the coordenates to the details view
        allMarkers.forEach(ele => {
          if ( JSON.parse(ele).point === 'Point A') {
            pointAString = `${JSON.parse(ele).lat.toFixed(6)}  ${JSON.parse(ele).long.toFixed(6)}`;
          } else {
            pointBString = `${JSON.parse(ele).lat.toFixed(6)}  ${JSON.parse(ele).long.toFixed(6)}`;
          }
        });

        self.sendPointA(pointAString);
        self.sendPointB(pointBString);

        let onDragStart = (e) => {

          let latLongStart = id.getLatLng();

          self.originalPins.forEach( ( element ) => {
            let jsonElement = JSON.parse(element);
            if(jsonElement.lat === latLongStart.lat) {
              draggedPinLat = jsonElement.lat;
              draggedPinLong = jsonElement.long;
            } else {
              notMovingPinLat = jsonElement.lat;
              notMovingPinLong = jsonElement.long;
            }
         });
        }
       //AIzaSyBgtMuNUviVT6JEC0iCb6v9g5o-0shf-no


        let onDragEnd = (e) => {

          let allMarkers = self.getMapMarkers(map);

          allMarkers.forEach(ele => {
            if ( JSON.parse(ele).point === 'Point A') {
              pointAString = `${JSON.parse(ele).lat.toFixed(6)}  ${JSON.parse(ele).long.toFixed(6)}`;
            } else {
              pointBString = `${JSON.parse(ele).lat.toFixed(6)}  ${JSON.parse(ele).long.toFixed(6)}`;
            }
          });


          self.sendPointA(pointAString);
          self.sendPointB(pointBString);
          self.clearAddress();

          let dist = self.distanceMeters(JSON.parse(allMarkers[0]).lat, JSON.parse(allMarkers[1]).lat, JSON.parse(allMarkers[0]).long, JSON.parse(allMarkers[1]).long);
          let lat = (e.target._latlng.lat);
          let lng = (e.target._latlng.lng);
          let newLatLng = new L.LatLng(lat, lng);
          id.setLatLng(newLatLng);
          //latLongEnd = id.getLatLng();

          let distanceBetween =  Math.floor( dist );
          self.dispatchDistance(distanceBetween);
        }

        id.on( 'dragend', onDragEnd );
        id.on( 'dragstart', onDragStart );

      }

      let allMarkers = this.getMapMarkers(map);
      allMarkers.forEach(ele => {
        if ( JSON.parse(ele).point === 'Point A') {
          pointAString = `${JSON.parse(ele).lat.toFixed(6)}  ${JSON.parse(ele).long.toFixed(6)}`;
        } else {
          pointBString = `${JSON.parse(ele).lat.toFixed(6)}  ${JSON.parse(ele).long.toFixed(6)}`;
        }
      });

      self.sendPointA(pointAString);
      self.sendPointB(pointBString);

      // Print distance to UI
      let dist = this.distanceMeters( pins[0].lat, pins[1].lat, pins[0].long, pins[1].long );
      this.point1 = pins[ 0 ].title;
      this.point2 = pins[ 1 ].title;
      this.distanceBetween =  Math.floor( dist );
      this.dispatchDistance( this.distanceBetween );
    });
  }

  getMapMarkers = (map) => {
    let allMarkers = [];
    map.eachLayer(function(layer) {
      if( layer.options && layer.options.pane === "markerPane" ) {
          let whichPoint = layer._tooltip._content.indexOf( 'Point A' ) !== -1 ? 'Point A' : 'Point B';

          allMarkers.push( `{ "lat" : ${layer._latlng.lat}, "long" : ${layer._latlng.lng }, "point" : "${ whichPoint }"}` );
      }
    });
    return allMarkers;
  }

  dispatchDistance = (dist) => {
    this.ngRedux.dispatch(
      {
        type: 'GETDISTANCE',
        unitMeasure: 'kilometer',
        constNumber: Constants.DISTANCEUNITCONVERTER,
        mydistance: dist,
        firstTime:true
      }
    )
  }

  distanceMeters = ( lat1: number, lat2: number, lon1: number, lon2: number ) => {

    const R = 6371e3; // metres
    const degToRad = Math.PI/180;
    let φ1 = lat1 * degToRad;
    let φ2 = lat2 * degToRad;
    let Δφ = ( lat2-lat1 ) * degToRad;
    let Δλ = ( lon2-lon1 ) * degToRad;

    let a = Math.sin( Δφ / 2 ) * Math.sin(Δφ/2) +
            Math.cos( φ1 ) * Math.cos( φ2 ) *
            Math.sin( Δλ / 2 ) * Math.sin( Δλ / 2 );

    let c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt ( 1 - a ) );
    let d = ( R * c ) / 1000 ;//kilometer
    this.mydistance = d;
    return d;
  }
}
