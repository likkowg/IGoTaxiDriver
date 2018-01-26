import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import { PlaceService } from '../../services/place-service';
import { DriverService } from "../../services/driver-service";

//declare var google: any;


@Injectable()
export class LocationTrackerProvider {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;
  driver: any;

  constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation,
    public geolocation: Geolocation, public placeService: PlaceService, public driverService: DriverService) {

    // get user info from service
    driverService.getDriver().take(1).subscribe(snapshot => {
      this.driver = snapshot;
    });
  }




  startTracking() {
    /*
        this.geolocation.getCurrentPosition().then((resp) => {
          let latLng = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
          let geocoder = new google.maps.Geocoder();
    
          // find address from lat lng
          geocoder.geocode({ 'latLng': latLng }, (results, status) => {
            if (status == google.maps.GeocoderStatus.OK) {
              // save locality
              let locality = this.placeService.setLocalityFromGeocoder(results);
              console.log('locality', locality);
    
              // start tracking
    
              // check for driver object, if it did not complete profile, stop updating location
              if (!this.driver || !this.driver.type) {
                return;
              }
    
              this.geolocation.getCurrentPosition().then((resp) => {
                this.driverService.updatePosition(this.driver.$key, this.driver.type, locality, resp.coords.latitude,
                  resp.coords.longitude, this.driver.rating, this.driver.name);
    
              }, err => {
                console.log(err);
              });
    
            }
          });
        }, err => {
          console.log(err);
        });
    */


    // Background Tracking

    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true,
      interval: 2000,
      notificationTitle: "Uso de GPS",
      notificationText: "Activado"
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.driverService.updatePosition(this.driver.$key, this.driver.type, "Peru", this.lat,
          this.lng, this.driver.rating, this.driver.name);
      });

    }, (err) => {

      console.log(err);

    });

    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();


    // Foreground Tracking

    let options = {
      frequency: 3000,
      enableHighAccuracy: true
    };

    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

      console.log(position);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.driverService.updatePosition(this.driver.$key, this.driver.type, "Peru", this.lat,
          this.lng, this.driver.rating, this.driver.name);
      });

    });
  }

  stopTracking() {

    console.log('stopTracking');

    this.backgroundGeolocation.finish();
    this.backgroundGeolocation.stop();
    this.watch.unsubscribe();
    this.driverService.clearPositions(this.driver.$key, this.driver.type, "Peru")
  }

}