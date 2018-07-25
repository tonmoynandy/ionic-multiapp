import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { LandingPage } from '../pages/landing/landing';
import { LocationPage } from '../pages/location/location';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//import { AndroidPermissions } from '@ionic-native/android-permissions';
//import { AndroidPermissionsMock } from '@ionic-native-mocks/android-permissions';
import { Geolocation } from '@ionic-native/geolocation';
//import { GeolocationMock } from '@ionic-native-mocks/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    LocationPage,
    LandingPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    LocationPage,
    LandingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
   // {provide: Geolocation, useClass: GeolocationMock},
    Diagnostic,
    //AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
