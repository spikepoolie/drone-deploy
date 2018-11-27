import { Component, OnInit } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { DpState } from '../store';
import { Constants } from '../constants';
import { DistanceUnitService } from '../distance-unit.service';

@Component({
  selector: 'app-unit-setup',
  templateUrl: './unit-setup.component.html',
  styleUrls: ['./unit-setup.component.css']
})

export class UnitSetupComponent implements OnInit {
  distanceBetween = 0;
  hasMilesBeenClicked = false;
  hasKilometersBeenClicked = false;

  constructor(
      private ngRedux: NgRedux<DpState>,
      private distanceUnitService: DistanceUnitService
    ) {
    ngRedux.subscribe(() => {
     var store = ngRedux.getState();
     this.distanceBetween = store.distance;
    });
   }

  ngOnInit() {}

  sendMessage = (unMeasure) => this.distanceUnitService.sendMessage( unMeasure );

  isKilometerChecked = ( unMeasure ) => {
    this.sendMessage(unMeasure);
    if( unMeasure === 'kilometers' ) {
      this.hasMilesBeenClicked = false;
      this.hasKilometersBeenClicked = true;
    } else {
      this.hasMilesBeenClicked = true;
      this.hasKilometersBeenClicked = false;
    }
    this.ngRedux.dispatch(
      {
        type: 'GETDISTANCE' ,
        unitMeasure: unMeasure,
        constNumber: Constants.DISTANCEUNITCONVERTER,
        mydistance: this.distanceBetween
      }
    );
   }
}
