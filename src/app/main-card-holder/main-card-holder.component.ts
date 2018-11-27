import { Component, OnInit } from '@angular/core'
import { UnitSetupComponent } from '../unit-setup/unit-setup.component';
import { DistanceBetweenComponent } from '../distance-between/distance-between.component';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-main-card-holder',
  templateUrl: './main-card-holder.component.html',
  styleUrls: ['./main-card-holder.component.css']
})
export class MainCardHolderComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

}
