import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the LocationPlaceDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-location-place-details',
  templateUrl: 'location-place-details.html',
})

export class LocationPlaceDetailsPage {
  place : any = {} ;
  activeTab : number = 1;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl : ViewController,
    public geo : Geolocation
  ) {
    const placeId = this.navParams.get('placeId');
    const map = this.navParams.get('map');
    var service = new google.maps.places.PlacesService(map);
    
      service.getDetails({
        placeId: placeId
      }, (placeDetails, status)=> {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(placeDetails);
          this.place = placeDetails;
        }
      });
  }
  
  ionViewDidLoad() {
    
    //console.log('ionViewDidLoad LocationPlaceDetailsPage');
  }
 

}
