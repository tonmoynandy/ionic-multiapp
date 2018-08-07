import { Component, OnInit, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController, AlertController, } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {WeatherProvider} from '../../providers/weather/weather';
declare var google;
@IonicPage()
@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage implements OnInit {
  public ionScroll;
  type : string = 'c';
  loader : boolean = true;
  tabContent: string ='overview';
  locationTextStatus : boolean = false;
  currentLocation : any = {
    lat : "",
    lng : "",
    address : ''
  }
  weatherData : any = {
    clouds : {
      all : 0
    },
    main : {
      humidity : '',
      pressure : '',
      temp : '',
      temp_max : '',
      temp_min : ''
    },
    weather : [],
    wind : {
      speed :'',
      deg : '',
      dist : ''
    },
    sys : {
      sunrise : '',
      sunset : ''
    },
    visibility : ''
  };
  weatherForcast:any = {
    list : []

  };
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public platform : Platform,
    public geoLoc : Geolocation,
    public weather :WeatherProvider,
    public loaderctrl : LoadingController,
    public myElement: ElementRef,
    public alertCtrl : AlertController
  ) {
    this.getCurrentLocationWeather();
  }
  ngOnInit() {
    this.ionScroll = this.myElement.nativeElement.children[1].children[1]; // div class = 'scroll-content'
  }
  scrollToTop(scrollDuration) {
    let scrollStep = -this.ionScroll.scrollTop / (scrollDuration / 15);
    let scrollInterval = setInterval( () => {
        if ( this.ionScroll.scrollTop != 0 ) {
            this.ionScroll.scrollTop = this.ionScroll.scrollTop + scrollStep;
        } else {
          clearInterval(scrollInterval);
        }
    }, 15);
  }
  ionViewDidLoad() {
    
  }
  toggleLocationText()
  {
    this.locationTextStatus = (this.locationTextStatus==true)?false:true;
    if (this.locationTextStatus == true) {
      
      setTimeout(()=>{
        let searchInput = document.getElementById("toolbar-textbox");
        var options = {
          componentRestrictions: {country: "in"}
         };
        let searchBox = new google.maps.places.Autocomplete(searchInput,options);
        searchBox.addListener('place_changed', ()=>{
          let selectLocation = searchBox.getPlace();
          if (selectLocation.geometry != undefined){
            this.currentLocation.lat = selectLocation.geometry.location.lat();
            this.currentLocation.lng = selectLocation.geometry.location.lng();
            this.currentLocation.address = selectLocation.name;
    
            var loadingContent = this.loaderctrl.create({
              content: 'Please wait, Weaher forcast is reloading ...',
            })
            loadingContent.present();
            this.getWeather().then(()=>{
              loadingContent.dismiss();
            });
          } else {
            const alert = this.alertCtrl.create({
              title : 'Error',
              message : 'No Location Found'
            })
            alert.present();
          }
        });
      },500);
    }
    
  }
  
  getCurrentLocationWeather()
  {
    this.locationTextStatus = false;
    this.tabContent ='overview';
    var loadingContent = this.loaderctrl.create({
      content: 'Please wait, Weather is fatching...',
    })
    loadingContent.present();
    this.geoLoc.getCurrentPosition()
    .then((resp : any) =>
    {
      this.currentLocation.address = '';
      this.currentLocation.lat = resp['coords']['latitude'];
      this.currentLocation.lng = resp['coords']['longitude'];
      this.weather.getLocationFromLatLng(this.currentLocation).subscribe((responseData)=>{
        if (responseData['status'] == 'OK') {
          //console.log(responseData);
          this.currentLocation.address = responseData['results'][0]['formatted_address'];
          this.getWeather().then(()=>{
            loadingContent.dismiss();
            this.scrollToTop(1000);
          });
        }
      });
      //console.log(resp['coords']);
      
    })
  }
  getWeather()
  {
    
    return new Promise((resolve, reject)=>{
      
        this.weather.getCurrentWeather({
          lat:this.currentLocation.lat, 
          lng:this.currentLocation.lng,
          type :this.type
        }).subscribe((responseData)=>{
          
          this.weatherData = responseData;
          //console.log(this.weatherData);
          this.loader = false;
          
          resolve();
        });
      
    }) 
  }
  gotToForcust()
  {
   if (this.tabContent != 'forcust') {
    var loadingContent = this.loaderctrl.create({
      content: 'Please wait, Weaher forcast is reloading ...',
    })
    loadingContent.present();
   this.tabContent='forcust';
   this.weather.getForcastWeather({
      lat:this.currentLocation.lat, 
      lng:this.currentLocation.lng,
      type :this.type
    }).subscribe((responseData)=>{
      
      this.weatherForcast = responseData;
      //console.log(this.weatherForcast);
      loadingContent.dismiss();
    });
   }
    
  }
  doRefresh(refresher) {
    var loadingContent = this.loaderctrl.create({
      content: 'Please wait, Weaher is reloading ...',
    })
    loadingContent.present();
    this.getWeather().then(()=>{
      loadingContent.dismiss();
      //console.log('Async operation has ended');
      refresher.complete();
    });

    
  }

}
