import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the WeatherProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class WeatherProvider {
  httpOptions = {};
  APPLICATION_NAME =  'weather-api';
	//API_URL = 'https://apibinssoft.herokuapp.com';
	API_URL = 'http://localhost:8080';
  constructor(public http: HttpClient) {
    this.httpOptions = {
     headers: new HttpHeaders({
	  	'Access-Control-Allow-Origin' : "*",
	  	"Access-Control-Allow-Credentials": "true",
	  	"Access-Control-Allow-Methods" : "GET,HEAD,OPTIONS,POST,PUT",
	  	"Access-Control-Allow-Headers": "access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type",
	    'Content-Type':  'application/json'
	  })
    };

  }

  getCurrentWeather(latLng) {
    return this.http.post(this.API_URL+'/'+this.APPLICATION_NAME+'/current', JSON.stringify(latLng), this.httpOptions);
  }

  getForcastWeather(latLng) {
    return this.http.post(this.API_URL+'/'+this.APPLICATION_NAME+'/forcast', JSON.stringify(latLng), this.httpOptions);
  }

}
