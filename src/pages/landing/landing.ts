import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { LocationPage } from '../location/location';
import { WeatherPage } from '../weather/weather';
/**
 * Generated class for the LandingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, 
  	public navParams: NavParams,
  	public loadCtrl : LoadingController) {
  }

  ionViewDidLoad() {


    console.log('ionViewDidLoad LandingPage');
    // let loader = this.loadCtrl.create({
    // 	content : 'Synchronizing ...'
    // });
   // loader.present();
  }

  gotToPage(pageName) {
    switch(pageName) {
      case 'map' :
        this.navCtrl.push(LocationPage);
      break;
      case 'weather' :
        this.navCtrl.push(WeatherPage);
      break;
    }
  }

}
