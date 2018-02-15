import { Component, ViewChild } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { SupportPage } from '../pages/support/support';
import { JobHistoryPage } from '../pages/job-history/job-history';
import { AuthService } from '../services/auth-service';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { TripService } from '../services/trip-service';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PlaceService } from '../services/place-service';
import { TRIP_STATUS_WAITING, TRIP_STATUS_GOING } from '../services/constants';
import { PickUpPage } from '../pages/pick-up/pick-up';
import { DropOffPage } from '../pages/drop-off/drop-off';
import { LoginHomePage } from '../pages/login-home/login-home';
import { UserPage } from '../pages/user/user';
import { DriverService } from '../services/driver-service';
import { SettingsPage } from '../pages/settings/settings';
import { ProfilePage } from '../pages/profile/profile';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {
  apellido: any;
  name: any;
  originalCoords: any;
  rootPage: any;
  nav: any;
  positionTracking: any;
  driver: any;
  user: any = {};
  notificationAlreadyReceived = true;
  pages = [
    {
      title: 'Home',
      icon: 'ios-home-outline',
      count: 0,
      component: HomePage
    },
    /*{
      title: 'Wallet',
      icon: 'ios-albums',
      count: 0,
      component: WalletPage
    },*/
    {
      title: 'Historial',
      icon: 'md-time',
      count: 0,
      component: JobHistoryPage
    },
/*     {
      title: 'Configuración',
      icon: 'settings',
      count: 0,
      component: SettingsPage
    }, */
    {
      title: 'Reportar Fallas',
      icon: 'ios-help-circle-outline',
      count: 0,
      component: SupportPage
    },
  ];

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public placeService: PlaceService,
    afAuth: AngularFireAuth, public authService: AuthService, public tripService: TripService,
    public driverService: DriverService, private toastCtrl: ToastController, private localNotifications: LocalNotifications, 
    private _sanitizer: DomSanitizer) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
     
      // check for login stage, then redirect
      afAuth.authState.take(1).subscribe(authData => {
        if (authData) {
          let root: any = HomePage;

          // check for uncompleted trip
          tripService.getTrips().take(1).subscribe(trips => {
            trips.forEach(trip => {
              if (trip.status == TRIP_STATUS_WAITING) {
                tripService.setCurrentTrip(trip.$key);
                root = PickUpPage;
              } else if (trip.status == TRIP_STATUS_GOING) {
                tripService.setCurrentTrip(trip.$key);
                root = DropOffPage;
              }
            });


            // if all trip are completed, go to home page
            this.nav.setRoot(root);
          });
        } else {
          this.nav.setRoot(LoginHomePage);
        }
      });

      // get user data
      afAuth.authState.subscribe(authData => {
        console.log(authData);
        if (authData) {
          this.user = authService.getUserData();

          // get user info from service
          driverService.setUser(this.user);
          driverService.getDriver().subscribe(snapshot => {
            this.driver = snapshot;
            this.name = this.driver.name;
            this.apellido = this.driver.plastname;
            
          });
        } else {
          this.driver = null;
        }
      });
    });

    
  }



  /**
   * Open a page
   * @param page component
   */
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }



/*   showNotification(originalCoords) {
    this.localNotifications.schedule({
      text: originalCoords
    });

    //this.notificationAlreadyReceived = true;
  } */


  /**
   * View current user profile
   */
  viewProfile() {
    this.nav.push(ProfilePage, {
      user: this.user
    });
  }

  /**
   * Logout this app
   */
  logout() {
    this.authService.logout().then(() => {
      this.nav.setRoot(LoginHomePage);
    });
  }


  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Geo',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  getBackground(image) {
    //console.log(`url(${image})`)
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}
