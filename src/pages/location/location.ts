import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
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
	locationData : any = {
		lat : '',
		lng : ''
	}
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public platform : Platform,
  	public geoLoc : Geolocation,
  	public alertCtrl : AlertController,
  	public diagnostic: Diagnostic
  	//public permissions : AndroidPermissions
  	) {
			this.platform.ready().then(()=>{
				this.geoLoc.getCurrentPosition()
				.then((resp : any) =>
				{
					console.log(resp);
					console.log('Geolocation mocked inserted!');
					this.locationData.lat = resp['coords']['latitude'];
					this.locationData.lng = resp['coords']['longitude'];
					

				})
				.catch((error : any) =>
				{
					console.log('Error getting location', error);
				});
			})
	
		}
	
  ionViewDidLoad() {	
		console.log('ionViewDidLoad LocationPage');
  }

}
