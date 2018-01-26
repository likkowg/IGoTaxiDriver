
///////////////////////////   IONIC MODULES   ///////////////////////////
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { HttpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { Geolocation } from '@ionic-native/geolocation';
///////////////////////////////////////////////////////////////////////




////////////////////   ANGULARFIRE INITIAL MODULES   ///////////////////
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2/angularfire2';
///////////////////////////////////////////////////////////////////////




///////////////////////////   OTHER MODULES   /////////////////////////
import { AgmCoreModule } from '@agm/core';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
///////////////////////////////////////////////////////////////////////




/////////////////////////////   DIRECTIVES   ///////////////////////////
import { ParallaxDirective } from '../directives/parallax/parallax';
///////////////////////////////////////////////////////////////////////




/////////////////////////////   SERVICES   /////////////////////////////
import { ReportService } from '../services/report-service';
import { TransactionService } from '../services/transaction-service';
import { PlaceService } from '../services/place-service';
import { DealService } from '../services/deal-service';
import { TripService } from '../services/trip-service';
import { SettingService } from '../services/setting-service';
import { DriverService } from '../services/driver-service';
import { AuthService } from '../services/auth-service';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';
import { Crop } from '@ionic-native/crop';
///////////////////////////////////////////////////////////////////////




//////////////////////////////   PAGES   //////////////////////////////
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { JobHistoryPage } from '../pages/job-history/job-history';
import { ModalJobPage } from '../pages/modal-job/modal-job';
import { DropOffPage } from '../pages/drop-off/drop-off';
import { PickUpPage } from '../pages/pick-up/pick-up';
import { ProfilePage } from '../pages/profile/profile';
import { SupportPage } from '../pages/support/support';
import { WalletPage } from '../pages/wallet/wallet';
import { UserPage } from '../pages/user/user';
import { LoginHomePage } from '../pages/login-home/login-home';
import { VehiclePage } from '../pages/vehicle/vehicle';
import { SettingsPage } from '../pages/settings/settings';
///////////////////////////////////////////////////////////////////////




////////////////   ANGULARFIRE INITIAL CONFIGURATION   ////////////////
export const firebaseConfig = {
  apiKey: "AIzaSyDt7CVcNmYijmjn-53RQrR3oOdneaHgSwQ",
  authDomain: "uberapp-ea235.firebaseapp.com",
  databaseURL: "https://uberapp-ea235.firebaseio.com",
  projectId: "uberapp-ea235",
  storageBucket: "uberapp-ea235.appspot.com",
  messagingSenderId: "646012761421"
};
///////////////////////////////////////////////////////////////////////




@NgModule({
  declarations: [
    MyApp,
    HomePage,
    JobHistoryPage,
    LoginPage,
    ModalJobPage,
    DropOffPage,
    PickUpPage,
    ProfilePage,
    RegisterPage,
    SettingsPage,
    SupportPage,
    WalletPage,
    UserPage,
    LoginHomePage,
    VehiclePage,
    ProfilePage,
    ParallaxDirective

  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    MomentModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyB0DSsFYLN9j9hrogzv-FCT_N0TLX9hx-A'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    JobHistoryPage,
    LoginPage,
    ModalJobPage,
    DropOffPage,
    PickUpPage,
    ProfilePage,
    RegisterPage,
    SettingsPage,
    SupportPage,
    WalletPage,
    UserPage,
    LoginHomePage,
    VehiclePage,
    ProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DriverService,
    Geolocation,
    AuthService,
    ReportService,
    TransactionService,
    PlaceService,
    DealService,
    TripService,
    SettingService,
    LocalNotifications,
    LocationTrackerProvider,
    BackgroundGeolocation,
    Crop,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
