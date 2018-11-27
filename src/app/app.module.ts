import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgRedux, NgReduxModule} from 'ng2-redux';
import { DpState, rootReducer, INITIAL_STATE } from './store';
import { AppComponent } from './app.component';
import { UnitSetupComponent } from './unit-setup/unit-setup.component';
import { MainCardHolderComponent } from './main-card-holder/main-card-holder.component';
import { LogoHeaderComponent } from './logo-header/logo-header.component';
import { DistanceBetweenComponent } from './distance-between/distance-between.component';
import { DetailsComponent } from './details/details.component';
import { DistanceUnitService } from './distance-unit.service';


@NgModule({
  declarations: [
    AppComponent,
    UnitSetupComponent,
    MainCardHolderComponent,
    LogoHeaderComponent,
    DistanceBetweenComponent,
    DetailsComponent
  ],
  imports: [
MDBBootstrapModule.forRoot(),
    BrowserModule,
    NgReduxModule
  ],
   schemas: [ NO_ERRORS_SCHEMA ],

  providers: [DistanceUnitService],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<DpState>){
    ngRedux.configureStore(rootReducer, INITIAL_STATE);
  }
}
