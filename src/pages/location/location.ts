import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController,  ActionSheetController, ModalController } from 'ionic-angular';
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
	  directionsService: any ;
	  directionsDisplay: any;
	  directionStatus : boolean = false;
	  directionType = [
		{
			name : 'Driving',
			value : 'DRIVING' 
		},
		{
			name : 'Walking',
			value : 'WALKING' 
		},
		{
			name : 'Transit',
			value : 'TRANSIT' 
		},
	  ];
	  directionFrm = {
		start :'',
		end : '',
		type : 'DRIVING',
	  }
  	currentMarker : any ;
	locationData : any = {
		lat : '',
		lng : ''
	}
	selectedLocation : any ;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public platform : Platform,
  		public geoLoc : Geolocation,
		public alertCtrl : AlertController,
		public loadCtrl : LoadingController,
		public actionSheet : ActionSheetController,
		public modal : ModalController
  	
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
		this.directionsService = new google.maps.DirectionsService;
		this.directionsDisplay = new google.maps.DirectionsRenderer;
		this.directionsDisplay.setMap(this.map);
		setTimeout(()=>{
			let searchInput = document.getElementById("directionFrom");
			searchInput.setAttribute("placeholder","Search Location");
			
			let searchBox = new google.maps.places.Autocomplete(searchInput);			

			searchBox.addListener('place_changed', ()=>{
				let selectLocation = searchBox.getPlace();
				this.selectedLocation = selectLocation;
				this.locationData.lat = selectLocation.geometry.location.lat();
				this.locationData.lng = selectLocation.geometry.location.lng();
				this.directionFrm.start = selectLocation.formatted_address;

				this.map.setCenter(new google.maps.LatLng(this.locationData.lat, this.locationData.lng));
				this.addMarker(this.locationData);
			})
		},1000);
		
		this.addMarker(this.locationData);
	}
	
	addMarker(latLng){
		if (this.currentMarker) {
			this.currentMarker.setMap(null);
		}
		this.currentMarker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: latLng
		});
	}
	addActionSheet()
	{
		let buttons = [
			{
				text: 'Direction',
				handler: () => {
					let options = {};
					if (this.selectedLocation) {
						options['selectLocation'] = this.selectedLocation;
					}
					this.directionStatus = true;
					let searchInput = document.getElementById("directionFrom");
					searchInput.setAttribute("placeholder","From");
					setTimeout(()=>{
						var searchInputTo = document.getElementById("directionTo");
						var searchBox = new google.maps.places.Autocomplete(searchInputTo);
						searchBox.addListener('place_changed', ()=>{
							let selectLocation = searchBox.getPlace();
							this.directionFrm.end = selectLocation.formatted_address;
							this.displayDirection();
							
						});
					},500)
				}
			}
		];

		const actions =this.actionSheet.create({
			title : 'Action',
			buttons : buttons
		})
		actions.present();
	}
	changeDirectionType(type) {
		this.directionFrm.type = type;
		this.displayDirection();
	}
	displayDirection()
	{
		let directionsDisplay = this.directionsDisplay;

		directionsDisplay.setMap(null);
		directionsDisplay.setMap(this.map);
		this.directionsService.route({
			origin: this.directionFrm.start,
			destination: this.directionFrm.end,
			travelMode: this.directionFrm.type
		}, function(response, status) {

			directionsDisplay.setDirections(response);

			console.log(response);
			
		});
	}
}
