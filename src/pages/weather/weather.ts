import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import {WeatherProvider} from '../../providers/weather/weather';

@IonicPage()
@Component({
  selector: 'page-weather',
  templateUrl: 'weather.html',
})
export class WeatherPage {
  type : string = 'c';
  loader : boolean = true;
  tabContent: string ='overview';
  
  currentLocation : any = {
    lat : "",
    lng : "",
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
    public loaderctrl : LoadingController
  ) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(()=>{
      var loadingContent = this.loaderctrl.create({
        content: 'Please wait, Weather is fatching...',
      })
      loadingContent.present();
      this.geoLoc.getCurrentPosition()
      .then((resp : any) =>
      {
        this.currentLocation.lat = resp['coords']['latitude'];
        this.currentLocation.lng = resp['coords']['longitude'];
        //console.log(resp['coords']);
        this.getWeather().then(()=>{
          loadingContent.dismiss();
        });
      })
    });
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
        console.log(this.weatherData);
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
      console.log(this.weatherForcast);
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
      console.log('Async operation has ended');
      refresher.complete();
    });

    
  }

}
