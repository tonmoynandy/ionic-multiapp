import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
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
	constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public geoLoc : Geolocation,
  	public alertCtrl : AlertController,
  	public diagnostic: Diagnostic
  	//public permissions : AndroidPermissions
  	) {

  }
	locationData : any = {
		lat : '',
		lng : ''
	}
  ionViewDidLoad() {
  	//this.diagnostic.requestLocationAuthorization().then(()=>{
			let options = {
				timeout :5000,
			}
	  	this.geoLoc.getCurrentPosition(options)
	  .then((resp : any) =>
	  {
	     console.log(resp);
			 console.log('Geolocation mocked!');
			 this.locationData.lat = resp['coords']['latitude'];
			 this.locationData.lng = resp['coords']['longitude'];
			 

	  })
	  .catch((error : any) =>
	  {
	     console.log('Error getting location', error);
	  });
	//}).catch(error=>{
		//console.log(error);
			// let alert = this.alertCtrl.create({
			// 		title : 'Error Permission Alert',
			// 		message :  error.json()
			// 	});
			// alert.present();
		//});
	console.log('ionViewDidLoad LocationPage');
  }

}
