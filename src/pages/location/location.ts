import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

/**
 * Generated class for the LocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})
export class LocationPage {
	@ViewChild('map') mapElement: ElementRef;
  map: any;
	locationData : any = {
		lat : '',
		lng : ''
	}
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public platform : Platform,
  	public geoLoc : Geolocation,
		public alertCtrl : AlertController,
		public loadCtrl : LoadingController
  	
  	//public permissions : AndroidPermissions
  	) {
			let loader = this.loadCtrl.create({
				content : "Map is Loading"
			})
			loader.present();
			this.platform.ready().then(()=>{
				this.geoLoc.getCurrentPosition()
				.then((resp : any) =>
				{
					console.log(resp);
					console.log('Geolocation mocked inserted!');
					this.locationData.lat = resp['coords']['latitude'];
					this.locationData.lng = resp['coords']['longitude'];
					this.loadMap();
					loader.dismiss();

					
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
	
	loadMap(){
 
    let latLng = new google.maps.LatLng(this.locationData.lat, this.locationData.lng);
 
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
 
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		this.addMarker(this.locationData);
	}
	addMarker(latLng){
		new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: latLng
		});
	}
}
