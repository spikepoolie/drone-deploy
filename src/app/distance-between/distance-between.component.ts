import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgRedux } from 'ng2-redux';
import { DpState } from '../store';
import { DistanceUnitService } from '../distance-unit.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-distance-between',
  templateUrl: './distance-between.component.html',
  styleUrls: ['./distance-between.component.css']
})


export class DistanceBetweenComponent implements OnInit {

  mydistance = 0;
  unitMeasure: string;
  subscription: Subscription;

  constructor(
    private ngRedux: NgRedux<DpState>,
    private distanceUnitService: DistanceUnitService
  ) {
    ngRedux.subscribe( () => {
     var store = ngRedux.getState();
     this.mydistance = store.distance;
    });
    this.subscription = this.distanceUnitService.getMessage().subscribe( message => { this.unitMeasure = message.text; } );
  }

  ngOnInit() {}

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

}
