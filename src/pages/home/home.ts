import { Component } from '@angular/core';
import { NavController, ModalController, AlertController } from 'ionic-angular';
import { DriverService } from '../../services/driver-service';
import { ModalJobPage } from '../modal-job/modal-job';
import { PickUpPage } from "../pick-up/pick-up";
import { DEAL_STATUS_PENDING, DEAL_TIMEOUT } from "../../services/constants";
import { DealService } from "../../services/deal-service";
import { UserPage } from "../user/user";
import { AuthService } from "../../services/auth-service";
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ReportService } from '../../services/report-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  driver: any;
  deal: any;
  dealSubscription: any;
  isOnline: boolean;
  public stats: any = {
    today: 0,
    yesterday: 0,
    thisMonth: 0,
    lastMonth: 0,
    thisYear: 0,
    lastYear: 0
  };

  constructor(public nav: NavController, public driverService: DriverService, public modalCtrl: ModalController,
    public alertCtrl: AlertController, public dealService: DealService, public authService: AuthService,
    public locationTracker: LocationTrackerProvider, public localNotifications: LocalNotifications,
    public reportService: ReportService) {

    //this.isOnline = false;
    if (this.dealSubscription) {
      this.dealSubscription.unsubscribe();
    }


    /*this.backgroundMode.disable();
    this.backgroundMode.on('activate').subscribe(() => {
      this.showNotification("background!");
      this.dealService.getDeal(this.driver.$key).subscribe(snapshot => {

        //if (snapshot != null) {
        this.showNotification("New ride available background!");
        console.log("New ride available");
        // }

      });
    });*/


    //this.backgroundMode.on('deactivate').subscribe(() => {
    //this.dealService.getDeal(this.driver.$key).subscribe().unsubscribe();
    //});


    // get user info from service
    driverService.getDriver().take(1).subscribe(snapshot => {
      this.driver = snapshot;

      // if user did not complete registration, redirect to user setting
      if (this.driver.plate && this.driver.type) {
        this.watchDeals();
      } else {
        this.nav.setRoot(UserPage, {
          user: authService.getUserData()
        });
      }
    });


    reportService.getAll().take(1).subscribe(snapshot => {
      let today = new Date();
      let lastYear = today.getFullYear() - 1;
      let lastMonth = (today.getMonth() > 0) ? today.getMonth() : 12;
      let yesterday = new Date(Date.now() - 86400000);
      let thisYear = today.getFullYear();
      let thisMonth = today.getMonth() + 1;

      // get current
      if (snapshot[thisYear]) {
        this.stats.thisYear = snapshot[thisYear].total;

        if (snapshot[thisYear][thisMonth]) {
          this.stats.thisMonth = snapshot[thisYear][thisMonth].total;

          if (snapshot[thisYear][thisMonth][today.getDate()]) {
            this.stats.today = snapshot[thisYear][thisMonth][today.getDate()].total;
          }
        }

        if ((lastMonth != 12) && snapshot[thisYear][lastMonth]) {
          this.stats.lastMonth = snapshot[thisYear][lastMonth].total;
        }
      }

      // get last year & last month data
      if (snapshot[lastYear]) {
        this.stats.lastYear = snapshot[lastYear].total;

        if ((lastMonth == 12) && snapshot[lastYear][lastMonth]) {
          this.stats.lastMonth = snapshot[lastYear][lastMonth].total;
        }
      }

      // get yesterday's data
      if (snapshot[yesterday.getFullYear()]
        && snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1]
        && snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1][yesterday.getDate()]) {
        this.stats.yesterday = snapshot[yesterday.getFullYear()][yesterday.getMonth() + 1][yesterday.getDate()].total;
      }
    });


  }

  ionViewWillLeave() {
    if (this.dealSubscription) {
      // unsubscribe when leave this page
      //this.dealSubscription.unsubscribe();
    }
  }

  // make array with range is n
  range(n) {
    return new Array(Math.round(n));
  }

  // confirm a job
  confirmJob() {
    let confirm = this.alertCtrl.create({
      title: 'Are you sure?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Disagree clicked');
            this.dealService.removeDeal(this.driver.$key);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.dealService.acceptDeal(this.driver.$key, this.deal).then(() => {
              // go to pickup page
              this.nav.setRoot(PickUpPage);
            });
          }
        }
      ]
    });
    confirm.present();
  }

  // listen to deals
  watchDeals() {
    // listen to deals
    this.dealSubscription = this.dealService.getDeal(this.driver.$key).subscribe(snapshot => {

      this.deal = snapshot;
      if (snapshot.status == DEAL_STATUS_PENDING) {

        // if deal expired
        if (snapshot.createdAt < (Date.now() - DEAL_TIMEOUT * 1000)) {
          return this.dealService.removeDeal(this.driver.$key);
        }

        this.showNotification("Tienes un nuevo trabajo!");
        // show modal
        let modal = this.modalCtrl.create(ModalJobPage, {
          deal: snapshot
        });

        // listen for modal close
        modal.onDidDismiss(confirm => {
          if (confirm) {
            // show confirm box
            this.confirmJob();
          } else {
            this.dealService.removeDeal(this.driver.$key);
            // do nothing
          }
        });

        modal.present();
      }
    });
  }


  start() {
    this.locationTracker.startTracking();
  }

  stop() {
    this.locationTracker.stopTracking();
  }


  statusChanged() {
    this.isOnline ? this.start() : this.stop();
    console.log(this.isOnline);
  }


  showNotification(msg) {
    this.localNotifications.schedule({
      text: msg
    });
  }
}
