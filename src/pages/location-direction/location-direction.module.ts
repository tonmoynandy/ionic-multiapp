import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationDirectionPage } from './location-direction';

@NgModule({
  declarations: [
    LocationDirectionPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationDirectionPage),
  ],
})
export class LocationDirectionPageModule {}
