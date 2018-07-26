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
	  directionDetailsStatus : boolean = false;
	  directionType = [
		{
			name : 'Driving',
			value : 'DRIVING',
			color : 'red', 
		},
		{
			name : 'Walking',
			value : 'WALKING',
			color : 'green', 
		},
		{
			name : 'Transit',
			value : 'TRANSIT' ,
			color : 'blue',
		},
	  ];
	  directionFrm = {
		start : {
			address:'',
			position : {
				lat : '',
				lng : ''
			}
		},
		end : {
			address:'',
			position : {
				lat : '',
				lng : ''
			}
		},
		type : 'DRIVING',
	  };
	directionDetails : any  = [];
	locationData : any = {
		lat : '',
		lng : ''
	}
	markers : any = [];
	selectedLocation : any ;
	constructor(public navCtrl: NavController, 
		public navParams: NavParams,
		public platform : Platform,
  		public geoLoc : Geolocation,
		public alertCtrl : AlertController,
		public loadCtrl : LoadingController,
		public actionSheet : ActionSheetController,
		public modal : ModalController


  	) {
			let loader = this.loadCtrl.create({
				content : "Map is Loading"
			})
			loader.present();
			this.platform.ready().then(()=>{
				this.geoLoc.getCurrentPosition()
				.then((resp : any) =>
				{
					//console.log(resp);
					//console.log('Geolocation mocked inserted!');
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
		//console.log('ionViewDidLoad LocationPage');
		
  }
	
	loadMap(){
 
    let latLng = new google.maps.LatLng(this.locationData.lat, this.locationData.lng);
 
    let mapOptions = {
		center: latLng,
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		mapTypeControl : false,
		fullscreenControl: false,
		traffic : true
		
    }
	    new Promise((resolve, reject )=>{
			this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
			this.directionsService = new google.maps.DirectionsService;
			this.directionsDisplay = new google.maps.DirectionsRenderer;
			this.directionsDisplay.setMap(this.map);

			var trafficLayer = new google.maps.TrafficLayer();
			trafficLayer.setMap(this.map);
		
			resolve();
		}).then(()=>{
			let searchInput = document.getElementById("directionFrom");
			searchInput.setAttribute("placeholder","Search Location");
			
			let searchBox = new google.maps.places.Autocomplete(searchInput);			

			searchBox.addListener('place_changed', ()=>{
				let selectLocation = searchBox.getPlace();
				//console.log(selectLocation);
				this.selectedLocation = selectLocation;
				this.locationData.lat = selectLocation.geometry.location.lat();
				this.locationData.lng = selectLocation.geometry.location.lng();
				this.directionFrm.start = {
					address : selectLocation.formatted_address,
					position : {
						lat: selectLocation.geometry.location.lat(),
						lng : selectLocation.geometry.location.lng()
					}
				};

				this.map.setCenter(new google.maps.LatLng(this.locationData.lat, this.locationData.lng));
				this.clearMarkers().then(()=>{
					this.addMarker(this.locationData);
				});
				
			})
		})
		
		this.addMarker(this.locationData);
	}
	
	addMarker(latLng){
		// if (this.currentMarker) {
		// 	this.currentMarker.setMap(null);
		// }
		this.markers.push(new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: latLng,
			icon : 'assets/marker1.png'
		}));
	}
	clearMarkers()
	{	return new Promise((resolve, reject)=>{
		
			if (this.markers.length > 0) {
				for(let m in this.markers) {
					let marker  = this.markers[m];
					marker.setMap(null);
					this.markers.splice(m,1);
				}
			}
			resolve();
		})
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
							this.directionFrm.end = {
								address : selectLocation.formatted_address,
								position : {
									lat: selectLocation.geometry.location.lat(),
									lng : selectLocation.geometry.location.lng()
								}
							};
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
		this.directionFrm.type = type['value'];
		this.displayDirection();
	}
	displayDirection()
	{
		let colorObj = this.directionType.find((t)=>{
			return t.value == this.directionFrm.type;
		})
		let directionsDisplay = this.directionsDisplay;

		directionsDisplay.setMap(null);
		directionsDisplay.setMap(this.map);
		directionsDisplay.setOptions({
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: colorObj['color']
			}
		})
		this.clearMarkers().then(()=>{
			this.addMarker(this.directionFrm.start['position']);
			this.addMarker(this.directionFrm.end['position']);
		});
		this.directionsService.route({
			origin: this.directionFrm.start['address'],
			destination: this.directionFrm.end['address'],
			travelMode: this.directionFrm.type
		}, function(response, status) {

			directionsDisplay.setDirections(response);
			this.directionDetails = response['routes'];
			console.log(this.directionDetails);
			//console.log(JSON.stringify(response));
			
		});
	}
	showDirectionDetails()
	{
		//console.log("before "+ this.directionDetailsStatus);
		this.directionDetailsStatus = (this.directionDetailsStatus == true)? false:true;
		console.log(this.directionDetails);
	}
}
