import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController,  ActionSheetController } from 'ionic-angular';
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
		public loadCtrl : LoadingController,
		public actionSheet : ActionSheetController
  	
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
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl : false,
			fullscreenControl: false
    }
 
		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		setTimeout(()=>{
			var searchInput = document.createElement("input");
			searchInput.setAttribute("id",'pac-input');
			searchInput.setAttribute("placeholder","Search Location");
			var searchBox = new google.maps.places.Autocomplete(searchInput);
			this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(searchInput);

			searchBox.addListener('place_changed', ()=>{
				let selectLocation = searchBox.getPlace();
				this.locationData.lat = selectLocation.geometry.location.lat();
				this.locationData.lng = selectLocation.geometry.location.lng();
				//console.log(selectLocation);
				//console.log(this.locationData);
				this.map.setCenter(new google.maps.LatLng(this.locationData.lat, this.locationData.lng));
				this.addMarker(this.locationData);
			})
		},1000);
		
		this.addMarker(this.locationData);
	}
	addMarker(latLng){
		new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: latLng
		});
	}
	addActionSheet()
	{
		let buttons = [
			{
				text: 'Search Location',
				handler: () => {
					
				}
			}
		];

		const actions =this.actionSheet.create({
			title : 'Action',
			buttons : buttons
		})
		actions.present();
	}
}
