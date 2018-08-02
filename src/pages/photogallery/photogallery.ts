import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PhotoLibrary } from '@ionic-native/photo-library';

/**
 * Generated class for the PhotogalleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-photogallery',
  templateUrl: 'photogallery.html',
})
export class PhotogalleryPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private photoLibrary: PhotoLibrary) {
  }
  photoList : string = '';
  ionViewDidLoad() {
    this.photoLibrary.requestAuthorization().then(() => {
      this.photoLibrary.getLibrary().subscribe({
        next: library => {
          this.photoList = JSON.stringify(library);
          library.forEach(function(libraryItem) {
            console.log(libraryItem.id);          // ID of the photo
            console.log(libraryItem.photoURL);    // Cross-platform access to photo
            console.log(libraryItem.thumbnailURL);// Cross-platform access to thumbnail
            console.log(libraryItem.fileName);
            console.log(libraryItem.width);
            console.log(libraryItem.height);
            console.log(libraryItem.creationDate);
            console.log(libraryItem.latitude);
            console.log(libraryItem.longitude);
            console.log(libraryItem.albumIds);    // array of ids of appropriate AlbumItem, only of includeAlbumsData was used
          });
        },
        error: err => { this.photoList = ('could not get photos'); },
        complete: () => { console.log('done getting photos'); }
      });
    })
    .catch(err => this.photoList = ('permissions weren\'t granted'));
  }

}
