import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
/**
 * Generated class for the LocationDirectionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-location-direction',
  templateUrl: 'location-direction.html',
})
export class LocationDirectionPage {
  directionFrm = {
    start :'',
    end : '',
    type : '',
  }
  constructor(
    public platform : Platform,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public geo : Geolocation ) {
    
    
  }

  ionViewDidLoad() {
    
    this.platform.ready().then(()=>{
      //console.log(document.getElementById("directionTo").querySelector('input'));
      const fromInput = document.getElementById("directionFrom").querySelector('input');
      let fromAutoInput = new google.maps.places.Autocomplete(fromInput);
      fromAutoInput.addListener('place_changed', ()=>{
        let location = fromAutoInput.getPlace();
        this.directionFrm.start = location.formatted_address;
      })
      //let selectedLocation = this.navParams.get('selectLocation');
      //fromInput.value = selectedLocation.formatted_address;
      //fromAutoInput.set('place', this.navParams.get('selectLocation'));
      const toInput = document.getElementById("directionTo").querySelector('input');
      let toAutoInput = new google.maps.places.Autocomplete(toInput);
      toAutoInput.addListener('place_changed', ()=>{
        let location = toAutoInput.getPlace();
        this.directionFrm.end = location.formatted_address;
      })
      
    })
    console.log('ionViewDidLoad LocationDirectionPage');
  }

  getDirections()
  {
    console.log("set data",this.directionFrm);
    this.viewCtrl.dismiss(this.directionFrm);
  }
  closeModal()
  {
    this.viewCtrl.dismiss();
  }

}
