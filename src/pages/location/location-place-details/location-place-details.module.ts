import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationPlaceDetailsPage } from './location-place-details';

@NgModule({
  declarations: [
    LocationPlaceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationPlaceDetailsPage),
  ],
})
export class LocationPlaceDetailsPageModule {}
