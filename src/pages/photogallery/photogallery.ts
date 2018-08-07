import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform , normalizeURL} from 'ionic-angular';
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

  photoList : any = [];
  albumList : any = '';
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private photoLibrary: PhotoLibrary,
    private platform : Platform,
  ) {
    this.platform.ready().then(()=>{
      this.photoLibrary.requestAuthorization().then(() => {
        this.photoLibrary.getAlbums().then((albums)=>{
          //this.photoList = JSON.stringify(albums);
          this.albumList = albums;

          this.photoLibrary.getLibrary({ // optional options
            thumbnailWidth: 512,
            thumbnailHeight: 384,
            quality: 0.8,
            includeAlbumData: true, // default,
            itemsInChunk : 10,
            chunkTimeSec : 0.5
          }).subscribe(
            {
            
              next: library => {
                this.photoList.push(library);
               // this.albumList = JSON.stringify(library);
                /* var promises = [];
                for (let album  of albums) {
                  promises.push(new Promise((resolve , reject)=>{
                    let albumRow = {};
                    albumRow =  {
                      id : album.id,
                      name : album.title,
                      last_image : {}
                    };
                    albumRow['last_image'] = this.photoList.find(photo=>{
                      return photo.albumIds.findIndex(album.id) > -1
                    });
                    resolve(albumRow);
                  }));
                  
                  
                }
                Promise.all(promises).then((albumList)=>{
                  this.albumList = JSON.stringify(albumList);
                }) */
                /* var promises = [];
                library.forEach(function(libraryItem) {
                  promises.push(new Promise((resolve, reject)=>{
                    let albumId = 'Others';
                    if (libraryItem.albumIds) {
                      albumId = libraryItem.albumIds[0];
                    }
                    if (this.photoList[albumId] == undefined) {
                      this.photoList[albumId] = [];
                    }
                    this.photoList[albumId].push(libraryItem);
                    resolve();
                  }));
                });
                Promise.all(promises).then(()=>{
                  this.photoList = JSON.stringify(this.photoList);
                }) */
                //this.photoList = JSON.stringify(library);
                /* this.photoList = library;
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
                }); */
              },
              error: err => { this.photoList = ('could not get photos'); },
              complete: () => { console.log('done getting photos'); },
              
          }
        );

        },(err)=>{
          this.photoList = JSON.stringify(err);
        });
        
      })
      .catch(err => {
       // this.photoList = ('permissions weren\'t granted')
       this.photoList = JSON.stringify(err);
      });
    })
  }
  
  getAlbumName(id)
  {
    return this.albumList.find((album)=>{return album.id == id });
  }
  getImageUrl(url) {
    return normalizeURL(url);
  }
  ionViewDidLoad() {
    
  }

}
