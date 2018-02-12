import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController, AlertController, IonicPage } from 'ionic-angular';
import { AuthService } from "../../services/auth-service";
import * as firebase from 'firebase';
import { SettingService } from "../../services/setting-service";
import { HomePage } from "../home/home";
import { VehiclePage } from '../vehicle/vehicle';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular/platform/platform';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { File } from '@ionic-native/file';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var cordova: any;

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})

export class ProfilePage {
  storageDirectory: string = '';
  uid: string;
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

  private galleryOptions: CameraOptions = {
    allowEdit: false,
    destinationType: this.camera.DestinationType.FILE_URI,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    //targetWidth: 720,
    //targetHeight: 720,
    correctOrientation: true,
    quality: 90

  }
  private basePath: string = '/users/';

  constructor(public nav: NavController, public authService: AuthService, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    public settingService: SettingService, public alertCtrl: AlertController,
    private storage: Storage, public platform: Platform, private camera: Camera, private crop: Crop, 
    private file: File, private _sanitizer: DomSanitizer) {


    this.platform.ready().then(() => {
      // make sure this is on a device, not an emulation (e.g. chrome tools device mode)
    });

    let user = navParams.get('user');
    this.uid = user.uid;
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

  selectProfilePicture() {
    this.camera.getPicture(this.galleryOptions).then((imageUri) => {
      alert(imageUri);
      this.cropImage(imageUri, 90, 200, 200).then((croppedImage) => {
        this.file.resolveLocalFilesystemUrl(croppedImage).then((newImageUri) => {
          alert(JSON.stringify(newImageUri));
          let dirPath = newImageUri.nativeURL;
          let dirPathSegments = dirPath.split('/');
          dirPathSegments.pop();
          dirPath = dirPathSegments.join('/');
          alert(dirPath);
          this.file.readAsArrayBuffer(dirPath, newImageUri.name).then(async (buffer) => {
            alert("Prepare to upload" + dirPath + newImageUri.name);
            await this.upload(buffer);
          }).catch((err) => {
            alert(JSON.stringify(err));
          })
        })
      });
    });
  }

  async upload(buffer) {
    let blob = new Blob([buffer], { type: "images/jpeg" })
    alert("blob file:" + blob);
    let storage = firebase.storage();
    storage.ref('users/' + "Profile_" + this.uid + ".jpg").put(blob).then((d) => {
      alert("Done");
      this.user.photoURL = d.downloadURL;
    }).catch((err) => {
      alert(JSON.stringify(err));
    });
  }


  cropImage(image: string, quality: number, targetHeight: number, targetWidth: number) {
    return this.crop.crop(image, { quality, targetHeight, targetWidth });
  }

  getBackground(image) {
    console.log(`url(${image})`)
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
}

