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
	  directionDetailsStatus  = 'hidden';
	  directionType = [
		{
			name : 'Driving',
			value : 'DRIVING',
			color : 'red', 
		},
		{
			name : 'Walking',
			value : 'WALKING',
			color : '#377fff', 
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
					this.directionFrm.start = {
						address : 'Your Location',
						position : {
							lat: resp['coords']['latitude'],
							lng : resp['coords']['longitude']
						}
					};
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
		zoom: 18,
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
			searchInput.setAttribute("placeholder","Your Location");
			
			let searchBox = new google.maps.places.Autocomplete(searchInput);			
			searchBox.setComponentRestrictions(
				{'country': ['in']});
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
					// let searchInput = document.getElementById("directionFrom");
					// searchInput.setAttribute("placeholder","From");
					setTimeout(()=>{
						var searchInputTo = document.getElementById("directionTo");
						var searchBox = new google.maps.places.Autocomplete(searchInputTo);
						searchBox.setComponentRestrictions(
							{'country': ['in']});
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
		var polylineDotted = {};
		if(this.directionFrm.type == 'WALKING') {
			polylineDotted = {
				strokeColor: colorObj['color'],
				strokeOpacity: 0,
				fillOpacity: 0,
				icons: [
					{
						icon: {
							path: google.maps.SymbolPath.CIRCLE,
							fillOpacity: 1,
							scale: 5
						},
						offset: '0%',
						repeat: '15px'
					}
				],
			};
		} else {
			polylineDotted = {
				strokeColor: colorObj['color'],
				strokeOpacity: 1,
				fillOpacity: 0,
				strokeWeight:5
				
			};
		}
		directionsDisplay.setOptions({
			//suppressMarkers: true,
			polylineOptions: polylineDotted
		})
		this.clearMarkers().then(()=>{
			//this.addMarker(this.directionFrm.start['position']);
			//this.addMarker(this.directionFrm.end['position']);
		});
		var directionType = this.directionFrm.type;
		this.directionsService.route({
			origin: this.directionFrm.start.position.lat+', '+ this.directionFrm.start.position.lng,
			destination: this.directionFrm.end.position.lat+', '+ this.directionFrm.end.position.lng,
			travelMode: this.directionFrm.type
		}, function(response, status)  {

			directionsDisplay.setDirections(response);
			if (response['routes'].length > 0) {
				let html = '';
				
				for(let route of response['routes']) {
					html += '<div class="direction-details-content">';
						
					if (route.legs.length > 0) {
						for(let leg of route.legs) {
							html += '<div class="heading-container">';
							html += '<p class="details-heading">';
							if (directionType == 'TRANSIT') {
								html += '<span>'+leg.departure_time.text+'</span> - <span>'+leg.arrival_time.text+'</span>';
							} else {
								if (leg.summary != '') {
									html += '<span> via '+route.summary+'</span>';
								}
							}
							html += '</p>';
							html += '<p class="details-distence-heading">';
							html += '<span class="distence">'+leg.distance.text+'</span>';
							html += '<span class="duration">'+leg.duration.text+'</span>';
							html += '</p>';
							html += '<div class="clearfix"></div>';
							html += '</div>';
							html += '<p class="details-main-heading"><strong class="start-point">'+ leg.start_address+'</strong></p>';

							//if (directionType != 'TRANSIT') {
								if (leg.steps.length > 0) {
									let step ;
									for(let stepIndex in leg.steps) {
										step = leg.steps[stepIndex];
										html += '<div class="details-content '+step.travel_mode+'" >';
										html += '<div class="step-description">'+step.instructions;
										if (step.steps != undefined) {
											html += '<div class="sub-content" data-step="'+stepIndex+'">';
											for (let subStep of step.steps) {
												html += '<div class="details-content '+subStep.travel_mode+'">';
												html += '<div class="step-description">'+subStep.instructions+'</div>';
												html += '<div class="step-distence">';
												html += '<span class="distence">'+subStep.distance.text+'</span>';
												html += '<span class="duration">'+subStep.duration.text+'</span>';
												html += '</div>';
												html += '<div class="clearfix"></div>';
												html += '</div>';
											}
											html += '</div>';
										}
										html += '</div>';
										html += '<div class="step-distence">';
										html += '<span class="distence">'+step.distance.text+'</span>';
										html += '<span class="duration">'+step.duration.text+'</span>';
										html += '</div>';
										html += '<div class="clearfix"></div>';
										html += '</div>';
									}
								}
							//} else {

							//}

							html += '<p class="details-main-heading"><strong class="end-point">'+ leg.end_address+'</strong></p>';
							
						}
						
					}
					html += '</div>';
				}
				document.getElementById('directionDetailsContent').innerHTML = (html);
				
			}
			console.log(response);
			return response;
			
		});
		
	}
	showDirectionDetails()
	{
		//console.log("before "+ this.directionDetailsStatus);
		this.directionDetailsStatus = (this.directionDetailsStatus == 'hidden')? 'display':'hidden';
		console.log(this.directionDetails);
	}
}
