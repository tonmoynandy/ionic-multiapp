import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
	locationData : any ;
  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public geoLoc : Geolocation,
  	public alertCtrl : AlertController,
  	public permissions : AndroidPermissions) {

  }

  ionViewDidLoad() {
	this.permissions.checkPermission(this.permissions.PERMISSION.LOCATION_HARDWARE).then(
		
	  result => {
	  		if (result) {
		  	  	if ( result.hasPermission) {
		  	  		this.geoLoc.getCurrentPosition()
		  		      .then((resp : any) =>
		  		      {
		  		      		this.locationData = resp;
		  		         console.dir(resp);
		  		         console.log('Geolocation mocked!');
		  		      })
		  		      .catch((error : any) =>
		  		      {
		  		         console.log('Error getting location', error);
		  		      });
		  	  	}
		  	  	console.log('Has permission?',result.hasPermission)
	  	   }
	  },
	  err => this.permissions.requestPermission(this.permissions.PERMISSION.LOCATION_HARDWARE)
	);

	this.permissions.requestPermissions([this.permissions.PERMISSION.LOCATION_HARDWARE, this.permissions.PERMISSION.GET_ACCOUNTS]);
    console.log('ionViewDidLoad LocationPage');
  }

}
