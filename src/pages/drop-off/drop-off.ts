import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { TripService } from "../../services/trip-service";
import { DealService } from "../../services/deal-service";
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { LaunchNavigatorOptions, LaunchNavigator } from '@ionic-native/launch-navigator';

/*
 Generated class for the DropOffPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-drop-off',
  templateUrl: 'drop-off.html'
})
export class DropOffPage {
  // trip info
  public trip: any;

  constructor(public nav: NavController, public tripService: TripService, public alertCtrl: AlertController,
              public dealService: DealService, private launchNavigator: LaunchNavigator) {
    this.trip = tripService.getCurrentTrip();
  }

  // show payment popup
  showPayment() {
    let prompt = this.alertCtrl.create({
      title: 'Total (cash):',
      message: '<h1>' + this.trip.currency + this.trip.fee + '</h1>',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // update this trip
            this.tripService.dropOff(this.trip.$key);
            // clear deal
            this.dealService.removeDeal(this.trip.driverId);
            // comeback to home page
            this.nav.setRoot(HomePage);
          }
        }
      ]
    });

    prompt.present();
  }

  navigate(destination) {
    let options: LaunchNavigatorOptions = {
      //start: 'London, ON',
      transportMode: this.launchNavigator.TRANSPORT_MODE.TRANSIT,


      //app: this.launchNavigator.APP.UBER
    };

    //let coordenates: string = latitude + ", " + longitute;
    this.launchNavigator.navigate(destination, options)
      .then(
      success => console.log('Launched navigator'),
      error => console.log('Error launching navigator', error)
      );
  }
}
