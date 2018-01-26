import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { SettingService } from '../../services/setting-service';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AuthService } from '../../services/auth-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';

/**
 * Generated class for the VehiclePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-vehicle',
  templateUrl: 'vehicle.html',
})
export class VehiclePage {

  user = {
    name: '',
    photoURL: '',
    vehiclePhotoURL: '',
    phoneNumber: '',
    plate: '',
    brand: '',
    type: '',
    plastname: '',
    mlastname: '',
    dni: '',
    model: ''
  };
  types: Array<any> = [];

  constructor(public nav: NavController, public authService: AuthService, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public settingService: SettingService, public alertCtrl: AlertController, public afAuth: AngularFireAuth) {
    let user = navParams.get('user');

    // list of vehicle types
    this.settingService.getVehicleType().take(1).subscribe(snapshot => {
      ''
      if (snapshot.$value === null) {
        this.settingService.getDefaultVehicleType().take(1).subscribe(snapshot => {
          this.types = Object.keys(snapshot);
        })
      } else {
        this.types = Object.keys(snapshot);
      }
    });

    this.authService.getUser(user.uid).take(1).subscribe(snapshot => {
      snapshot.uid = snapshot.$key;
      this.user = snapshot;
    });
  }

  // save user info
  save() {
    if (!this.user.plate) {
      return this.showAlert('El número de placa no puede estar vacia!')
    }
    if (!this.user.brand) {
      return this.showAlert('La marca del vehiculo no puede estar vacia!')
    }
    if (!this.user.type) {
      return this.showAlert('El tipo de vehiculo puede estar vacio!')
    }
    if (!this.user.model) {
      return this.showAlert('El modelo de vehiculo puede estar vacio!')
    }



    this.authService.updateUserProfile(this.user);

    this.nav.setRoot(HomePage);
    let toast = this.toastCtrl.create({
      message: 'Se ha actualizado el perfil de tu vehiculo',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  // choose file for upload
  chooseFile() {
    document.getElementById('vehicle').click();
  }

  // upload thumb for item
  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();
    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    loading.present();

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('vehicle')).files[0]]) {
      let path = '/vehicles/' + Date.now() + `${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        loading.dismiss();
        this.user.vehiclePhotoURL = snapshot.downloadURL;
      });
    }
  }

  // show alert with message
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  updateProfilePicture(picture: any = null): any {
    /*return this.ProfilePictureRef.child(this.afAuth.auth.currentUser.uid)
      .putString(picture, 'base64', { contentType: 'image/png' })
      .then((savedPicture) => {
        this.userProfile.child(this.afAuth.auth.currentUser.uid).update({
      storage()
          profilepicture: savedPicture.downloadURL
        });
      })*/
  }

}