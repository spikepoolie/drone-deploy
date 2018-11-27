import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { DpState } from '../store';
import { DistanceUnitService } from '../distance-unit.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  unitMeasure: string;
  subscription: Subscription;
  pointASub: Subscription;
  pointBSub: Subscription;
  myDistance = 0;
  pointA;
  pointB;
  address;
  showFullAddress = false;

  constructor(
    private ngRedux: NgRedux<DpState>,
    private distanceUnitService: DistanceUnitService
  ) {
    ngRedux.subscribe( () => {
      var store = ngRedux.getState();
      this.myDistance = store.distance;
     });
    this.subscription = this.distanceUnitService.getMessage().subscribe( message => { this.unitMeasure = message.text; } );
    this.pointASub = this.distanceUnitService.getPointA().subscribe( ptA => { this.pointASub = ptA.text; } );
    this.pointBSub = this.distanceUnitService.getPointB().subscribe( ptB => { this.pointBSub = ptB.text; } );
    this.address = this.distanceUnitService.getClearedAddress().subscribe( msg => { this.address = msg.text; } );
  }

  ngOnInit() {}

  showAddress(addr){
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${addr.split(" ")[0]},${addr.split(" ")[2]}&key=AIzaSyBgtMuNUviVT6JEC0iCb6v9g5o-0shf-no`)
    .then( response => response.json() )
    .then(( p ) => {
      this.showFullAddress = true;
      this.address = p.results[0].formatted_address
    })
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
