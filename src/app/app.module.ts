import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonicImageLoader } from 'ionic-image-loader';
//import { CacheFactory } from 'cachefactory';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LandingPage } from '../pages/landing/landing';
import { LocationPage } from '../pages/location/location';
import {LocationPlaceDetailsPage} from '../pages/location/location-place-details/location-place-details';
import { PhotogalleryPage } from '../pages/photogallery/photogallery';
import { WeatherPage } from '../pages/weather/weather';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {TempchangePipe} from '../pipes/tempchange/tempchange';
import {WinddirectionPipe} from '../pipes/winddirection/winddirection';
//import { AndroidPermissions } from '@ionic-native/android-permissions';
//import { AndroidPermissionsMock } from '@ionic-native-mocks/android-permissions';
import { Geolocation } from '@ionic-native/geolocation';
//import { GeolocationMock } from '@ionic-native-mocks/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { WeatherProvider } from '../providers/weather/weather';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LocationPage,
    LandingPage,
    LocationPlaceDetailsPage,
    WeatherPage,
    PhotogalleryPage,
    TempchangePipe,
    WinddirectionPipe
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicImageLoader.forRoot(),
    Ionic2RatingModule,
   // CacheFactory
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LocationPage,
    LandingPage,
    LocationPlaceDetailsPage,
    WeatherPage,
    PhotogalleryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
   // {provide: Geolocation, useClass: GeolocationMock},
    PhotoLibrary,
    Diagnostic,
    //AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    WeatherProvider
  ]
})
export class AppModule {}
