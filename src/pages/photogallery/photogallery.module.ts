import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotogalleryPage } from './photogallery';

@NgModule({
  declarations: [
    PhotogalleryPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotogalleryPage),
  ],
})
export class PhotogalleryPageModule {}
