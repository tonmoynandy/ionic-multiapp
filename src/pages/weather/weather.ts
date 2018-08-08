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
    public alertCtrl : AlertController,
  ) { }
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
    this.getCurrentLocationWeather();
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
          var selectLocation = searchBox.getPlace();
          if (selectLocation.id){
            this.currentLocation.lat = selectLocation.geometry.location.lat();
            this.currentLocation.lng = selectLocation.geometry.location.lng();
            this.currentLocation.address = selectLocation.name;
    
            var loadingContent = this.loaderctrl.create({
              content: 'Please wait, Weaher  is reloading ...',
            })
            loadingContent.present();
            this.getWeather().then((responseData)=>{
            this.weather.putCacheWeatherSearchPlace(
              {
                place: {
                  lat : this.currentLocation.lat,
                  lng : this.currentLocation.lng,
                  address : this.currentLocation.address
                }, weather : responseData});

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
    
    const currentCacheWeather = this.weather.getCacheWeatherCurrent();
    
    this.locationTextStatus = false;
    this.tabContent ='overview';
    var loadingContent = this.loaderctrl.create({
      content: 'Please wait, Weather is fatching...',
    })
    loadingContent.present();
    this.weather.setCurrentUserLocation().then((location)=>{
      this.currentLocation = location;
      this.getWeather().then((responseWeatherData)=>{
        loadingContent.dismiss();
        let cacheData = this.weather.putCacheWeatherCurrent(
          {
            place: location, 
            weather : responseWeatherData});
        this.scrollToTop(1000);
      });
    })
    if (currentCacheWeather == undefined) {
      this.geoLoc.getCurrentPosition()
      .then((resp : any) =>
      {
        
        //console.log(resp['coords']);
        
      })
    } else {
      this.weatherData = currentCacheWeather.weather;
      this.currentLocation.address = currentCacheWeather.place.address; 
      //console.log(this.weatherData);
      this.loader = false;
      loadingContent.dismiss();
    }
    
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
          
          resolve(responseData);
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
   const currentPlaceForcast = this.weather.getCacheWeatherForcastCurrentPlace();
   if (currentPlaceForcast) {
    this.weatherForcast = currentPlaceForcast.forcast;
    loadingContent.dismiss();
   } else {
    this.weather.getForcastWeather({
      lat:this.currentLocation.lat, 
      lng:this.currentLocation.lng,
      type :this.type
    }).subscribe((responseData)=>{
      this.weather.putCacheWeatherForcastCurrentPlace({
        place : {
          lat : this.currentLocation.lat,
          lng : this.currentLocation.lng,
        },
        forcast : responseData
      })
      this.weatherForcast = responseData;
      //console.log(this.weatherForcast);
      loadingContent.dismiss();
    });
   }
   
   }
    
  }
  doRefresh(refresher) {

    const currentCacheWeather = this.weather.getCacheWeatherCurrent();
    const currentCacheWeatherSearch = this.weather.getCacheWeatherSearchPlace();
    if (!currentCacheWeather && !currentCacheWeather) {
      var loadingContent = this.loaderctrl.create({
        content: 'Please wait, Weaher is reloading ...',
      })
      loadingContent.present();
      this.getWeather().then(()=>{
        loadingContent.dismiss();
        //console.log('Async operation has ended');
        refresher.complete();
      });
    } else {
      if (this.currentLocation.address == currentCacheWeather.place.address) {
        this.weatherData = currentCacheWeather.weather;
        this.currentLocation.address = currentCacheWeather.place.address; 
      } else if (this.currentLocation.address == currentCacheWeatherSearch.place.address) {
        this.weatherData = currentCacheWeatherSearch.weather;
        this.currentLocation.address = currentCacheWeatherSearch.place.address; 
      }
      refresher.complete();
    }
    

    
  }

}
