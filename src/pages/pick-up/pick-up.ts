import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DropOffPage } from '../drop-off/drop-off';
import { TripService } from "../../services/trip-service";
import { IonicPage } from 'ionic-angular/navigation/ionic-page';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
/*
 Generated class for the PickUpPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-pick-up',
  templateUrl: 'pick-up.html'
})
export class PickUpPage {
  // trip info
  trip: any;
  passenger: any;

  constructor(public nav: NavController, public tripService: TripService, private launchNavigator: LaunchNavigator) {
    this.trip = tripService.getCurrentTrip();
    tripService.getPassenger(this.trip.passengerId).take(1).subscribe(snapshot => {
      this.passenger = snapshot;
    })
  }

  // pickup
  pickup() {
    this.tripService.pickUp(this.trip.$key);
    this.nav.setRoot(DropOffPage);
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
