import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';
import { SettingService } from "../../services/setting-service";
import { HomePage } from "../home/home";
import { VehiclePage } from '../vehicle/vehicle';
import { Crop } from '@ionic-native/crop';
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  user = {
    name: '',
    photoURL: '',
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
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private crop: Crop,
    public settingService: SettingService, public alertCtrl: AlertController) {
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
    if (!this.user.name) {
      return this.showAlert('El nombre no puede estar vacio!')
    }
    if (!this.user.phoneNumber) {
      return this.showAlert('El numero de telefono no puede estar vacio!')
    }
    if (!this.user.plastname) {
      return this.showAlert('Los apellidos no pueden estar vacios!')
    }
    if (!this.user.mlastname) {
      return this.showAlert('Los apellidos no pueden estar vacios!')
    }
    if (!this.user.dni) {
      return this.showAlert('El DNI es un campo obligatorio')
    }


    this.authService.updateUserProfile(this.user);

    this.nav.setRoot(HomePage);
    let toast = this.toastCtrl.create({
      message: 'Tu perfil ha sido actualizado con exito',
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  // choose file for upload
  chooseFile() {
    document.getElementById('avatar').click();
  }

  // upload thumb for item
  upload() {
    // Create a root reference
    let storageRef = firebase.storage().ref();
    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    loading.present();

    for (let selectedFile of [(<HTMLInputElement>document.getElementById('avatar')).files[0]]) {
      let path = '/users/' + Date.now() + `${selectedFile.name}`;
      let iRef = storageRef.child(path);
      iRef.put(selectedFile).then((snapshot) => {
        loading.dismiss();
        this.user.photoURL = snapshot.downloadURL;
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

  ToVehicle() {
    this.nav.push(VehiclePage, {
      user: this.user
    });
  }

  cropImg() {
    this.crop.crop('C:/Users/Miriam Terrones/Pictures/Saved Pictures/test.jpg', {quality: 75, targetHeight: 200, targetWidth: 200})
    .then(
      newImage => console.log('new image path is: ' + newImage),
      error => console.error('Error cropping image', error)
    );
  }
}
