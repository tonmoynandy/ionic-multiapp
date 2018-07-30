import { Component , ViewChild, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController,  ActionSheetController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { resolveDefinition } from '@angular/core/src/view/util';

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
	  nearByStatus : boolean = false;
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
	nearByPlaceType = [
		{
			name : 'Airport',
			value : 'airport'
		},
		{
			name : 'Park',
			value : 'amusement_park'
		},
		{
			name : 'Art gallery',
			value : 'art_gallery'
		},
		{
			name : 'ATM',
			value : 'atm'
		},
		{
			name : 'Bakery',
			value : 'bakery'
		},
		{
			name : 'Bank',
			value : 'bank'
		},
		{
			name : 'Bar',
			value : 'bar'
		},
		{
			name : 'Beauty salon',
			value : 'beauty_salon'
		},
		{
			name : 'Bicycle store',
			value : 'bicycle_store'
		},
		{
			name : 'Book store',
			value : 'book_store'
		},
		{
			name : 'Bowling alley',
			value : 'bowling_alley'
		},
		{
			name : 'Bus station',
			value : 'bus_station'
		},
		{
			name : 'Cafe',
			value : 'cafe'
		},
		{
			name : 'Campground',
			value : 'campground'
		},
		{
			name : 'Car dealer',
			value : 'car_dealer'
		},
		{
			name : 'Car rental',
			value : 'car_rental'
		},
		{
			name : 'Car repair',
			value : 'car_repair'
		},
		{
			name : 'Car wash',
			value : 'car_wash'
		},
		{
			name : 'Casino',
			value : 'casino'
		},
		{
			name : 'Cemetery',
			value : 'cemetery'
		},
		{
			name : 'Church',
			value : 'church'
		},
		{
			name : 'Hall',
			value : 'city_hall'
		},
		{
			name : 'Clothing store',
			value : 'clothing_store'
		},
		{
			name : 'Dentist',
			value : 'dentist'
		},
		{
			name : 'Department store',
			value : 'department_store'
		},
		{
			name : 'Doctor',
			value : 'doctor'
		},
		{
			name : 'Electrician',
			value : 'electrician'
		},
		{
			name : 'Electronics store',
			value : 'electronics_store'
		},
		{
			name : 'Embassy',
			value : 'embassy'
		},
		{
			name : 'Fire station',
			value : 'fire_station'
		},
		{
			name : 'Florist',
			value : 'florist'
		},
		{
			name : 'Funeral home',
			value : 'funeral_home'
		},
		{
			name : 'Furniture store',
			value : 'furniture_store'
		},
		{
			name : 'Gas station',
			value : 'gas_station'
		},
		{
			name : 'Gym',
			value : 'gym'
		},
		{
			name : 'Hair care',
			value : 'hair_care'
		},
		{
			name : 'Hardware store',
			value : 'hardware_store'
		},
		{
			name : 'Hindu temple',
			value : 'hindu_temple'
		},
		{
			name : 'Home goods store',
			value : 'home_goods_store'
		},
		{
			name : 'Hospital',
			value : 'hospital'
		},
		{
			name : 'Insurance agency',
			value : 'insurance_agency'
		},
		{
			name : 'Jewelry store',
			value : 'jewelry_store'
		},
		{
			name : 'Laundry',
			value : 'laundry'
		},
		{
			name : 'Lawyer',
			value : 'lawyer'
		},
		{
			name : 'Library',
			value : 'library'
		},
		{
			name : 'Liquor store',
			value : 'liquor_store'
		},
		{
			name : 'Local government office',
			value : 'local_government_office'
		},
		{
			name : 'Lodging',
			value : 'lodging'
		},
		{
			name : 'Meal delivery',
			value : 'meal_delivery'
		},
		{
			name : 'Mosque',
			value : 'mosque'
		},
		{
			name : 'Movie theater',
			value : 'movie_theater'
		},
		{
			name : 'Moving company',
			value : 'moving_company'
		},
		{
			name : 'Museum',
			value : 'museum'
		},
		{
			name : 'Night club',
			value : 'night_club'
		},
		{
			name : 'Painter',
			value : 'painter'
		},
		{
			name : 'Parking',
			value : 'parking'
		},
		{
			name : 'Pet store',
			value : 'pet_store'
		},
		{
			name : 'Pharmacy',
			value : 'pharmacy'
		},
		{
			name : 'Physiotherapist',
			value : 'physiotherapist'
		},
		{
			name : 'Plumber',
			value : 'plumber'
		},
		{
			name : 'Police',
			value : 'police'
		},
		{
			name : 'Post office',
			value : 'post_office'
		},
		{
			name : 'Real estate agency',
			value : 'real_estate_agency'
		},
		{
			name : 'Restaurant',
			value : 'restaurant'
		},
		{
			name : 'Roofing contractor',
			value : 'roofing_contractor'
		},
		{
			name : 'School',
			value : 'school'
		},
		{
			name : 'Shoe store',
			value : 'shoe_store'
		},
		{
			name : 'Shopping mall',
			value : 'shopping_mall'
		},
		{
			name : 'Spa',
			value : 'spa'
		},
		{
			name : 'Stadium',
			value : 'stadium'
		},
		{
			name : 'Taxi stand',
			value : 'taxi_stand'
		},
		{
			name : 'Train station',
			value : 'train_station'
		},
		{
			name : 'Travel agency',
			value : 'travel_agency'
		},
		{
			name : 'Veterinary care',
			value : 'veterinary_care'
		},
		{
			name : 'Zoo',
			value : 'zoo'
		}
	]
	directionDetails : any  = [];
	locationData : any = {
		lat : '',
		lng : ''
	}
	myCurrentLocation : any = {
		lat : '',
		lng : ''
	};
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
					this.locationData.lat = this.myCurrentLocation.lat =  resp['coords']['latitude'];
					this.locationData.lng = this.myCurrentLocation.lng = resp['coords']['longitude'];
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
	{	
		let promises = [];
		
		return new Promise((finalResolve, finalReject)=>{
			if (this.markers.length > 0) {
				for(let m in this.markers) {
					promises.push(new Promise((resolve, reject)=>{
						let marker  = this.markers[m];
						marker.setMap(null);
						resolve()
					}));
				}
			}
			Promise.all(promises).then(()=>{
				this.markers = [];
				finalResolve();
			})
		})
	}
	placeType : string = '';
	autoCompletePlaceTypeList : any = [];
	selectedPlaceType : any = [];
	autoCompleteList()
	{
		if(this.placeType.length > 1) {
			this.autoCompletePlaceTypeList = this.nearByPlaceType.filter((item) => {
				let index = this.selectedPlaceType.findIndex(selectItem=>{
					return selectItem.value == item.value;
				})
				return item.name.toLowerCase().startsWith(this.placeType.toLowerCase()) && index == -1
			})
		}
		
	}
	selectPlaceType(placeType)
	{
		let index = this.autoCompletePlaceTypeList.findIndex(item=>{
			return item.value == placeType.value;
		})
		this.autoCompletePlaceTypeList.splice(index,1);
		
		this.selectedPlaceType.push(placeType);
	}
	removePlaceType(placeType) {
		let index = this.selectedPlaceType.findIndex(item=>{
			return item.value == placeType.value;
		})
		this.selectedPlaceType.splice(index,1);
	}
	nearByPlaceList :any = [];
	searchNearByPlace()
	{
		let selectedPlaceTypeValues = this.selectedPlaceType.map(function(value,index) {
			return value["value"];
		})
		let loader = this.loadCtrl.create({
			content : "Please wait"
		})
		loader.present();
		this.clearMarkers().then(()=>{
			var service = new google.maps.places.PlacesService(this.map);
			service.nearbySearch({
			location: this.directionFrm.start.position,
			radius: 500,
			type: selectedPlaceTypeValues
			}, (result, status)=>{
				if (status === google.maps.places.PlacesServiceStatus.OK) {
					this.nearByPlaceList = result;
					if (result.length > 0) {
					
						for(let place of result) {
							this.markers.push(new google.maps.Marker({
								map: this.map,
								animation: google.maps.Animation.DROP,
								position: { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() },
								icon : 'assets/marker.png'
							}))
						}
					}
					loader.dismiss();
				}
			});
		})
	}
	nearbyDetailsStatus : boolean = false;
	showNearByDetails()
	{
		this.nearbyDetailsStatus = (this.nearbyDetailsStatus == true)? false : true;
	}
	goToPlace(place)
	{
		this.nearbyDetailsStatus = false;
		this.map.setZoom(20);
		this.map.setCenter(new google.maps.LatLng( place.geometry.location.lat(), place.geometry.location.lng() ))
	}
	addActionSheet()
	{
		let buttons = [
			// direction //
			{
				text: 'Direction',
				handler: () => {
					let options = {};
					if (this.selectedLocation) {
						options['selectLocation'] = this.selectedLocation;
					}
					this.directionStatus = true;
					this.nearByStatus = false;
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
			},
			// end direction //
			// nearby search //
			{
				text : 'Nearby Search',
				handler : ()=>{
					this.directionStatus = false;
					this.nearByStatus = true;
				}
			}
			// end nearby // 
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
