import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CacheFactory } from 'cachefactory';
import { Geolocation } from '@ionic-native/geolocation';
/*
  Generated class for the WeatherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherProvider {
  httpOptions = {};
  APPLICATION_NAME =  'weather-api';
	API_URL = 'https://apibinssoft.herokuapp.com';
  //API_URL = 'http://localhost:8080';
  cache : any ;
  constructor(public http: HttpClient, public geoLoc : Geolocation) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin' : "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods" : "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type",
        'Content-Type':  'application/json'
      })
    };

    const cacheFactory = new CacheFactory();
    
    if (!cacheFactory.exists('weather')) {
      // Create the cache metadata. Any previously saved
      // data will be loaded.
      const weatherObj = this;
      this.cache = cacheFactory.createCache('weather', {
        // Delete items from the cache when they expire
        deleteOnExpire: 'aggressive',
    
        // Check for expired items every 60 seconds
        recycleFreq: 60 * 1000, // 60 sec
        maxAge : 3600 * 1000, // 1 hr
        onExpire: function (key, value, done) {
          switch(key) {
            case "current":
            let userLocation = weatherObj.getCurrentUserLocation();

            weatherObj.getCurrentWeather({lat : userLocation.lat, lng : userLocation.lng, type: 'c'}).subscribe((responseData)=>{
                let cacheData = {
                  place : userLocation,
                  weather : responseData
                }
                weatherObj.putCacheWeatherCurrent(cacheData)
              });
            break;
            case "current-forcast":
            let userForcastLocation = weatherObj.getCurrentUserLocation();
            weatherObj.getForcastWeather({lat : userForcastLocation.lat, lng : userForcastLocation.lng, type: 'c'}).subscribe((responseData)=>{
                let cacheData = {
                  place : userForcastLocation,
                  forcast : responseData
                }
                weatherObj.putCacheWeatherForcastCurrentPlace(cacheData)
              });
            break;
            case "current-location" :
              weatherObj.setCurrentUserLocation();
            break;
          }
        }
      });
    }

  }

  setCurrentUserLocation() {
    return new Promise((resolve, reject )=>{
      this.geoLoc.getCurrentPosition().then((locData:any)=>{
        let location = {
          lat : locData['coords']['latitude'],
          lng : locData['coords']['longitude'],
          address : ''
        };
        this.getLocationFromLatLng(location).subscribe((responseData)=>{
          
          if (responseData['status'] == 'OK') {
            location.address = responseData['results'][0]['formatted_address'];;
          }
          this.cache.put('current-location', location);
          resolve(location);
        })
      })
    })
  }
  getCurrentUserLocation()
  {
    return this.cache.get('current-location');
  }
  putCacheWeatherCurrent(weatherData){
    this.cache.put('current', weatherData);
  }
  getCacheWeatherCurrent()
  {
    return this.cache.get('current');
  }

  putCacheWeatherSearchPlace(weatherData){
    this.cache.put('search-current', weatherData);
  }
  getCacheWeatherSearchPlace()
  {
    return this.cache.get('search-current');
  }

  putCacheWeatherForcastCurrentPlace(weatherData){
    this.cache.put('current-forcast', weatherData);
  }
  getCacheWeatherForcastCurrentPlace()
  {
    return this.cache.get('current-forcast');
  }

  getCurrentWeather(latLng) {
    return this.http.post(this.API_URL+'/'+this.APPLICATION_NAME+'/current', JSON.stringify(latLng), this.httpOptions);
  }

  getForcastWeather(latLng) {
    return this.http.post(this.API_URL+'/'+this.APPLICATION_NAME+'/forcast', JSON.stringify(latLng), this.httpOptions);
  }

  getLocationFromLatLng(latlng) {
    let position = latlng.lat+','+latlng.lng;
    return this.http.get("http://maps.googleapis.com/maps/api/geocode/json?latlng="+position+"&sensor=true");
  }

}
