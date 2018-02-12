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
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Crop } from '@ionic-native/crop';
import { DomSanitizer } from '@angular/platform-browser';

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
  uid: string;
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
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, private camera: Camera, private crop: Crop,
    public settingService: SettingService, public alertCtrl: AlertController, public afAuth: AngularFireAuth,
    private _sanitizer: DomSanitizer) {
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

  // show alert with message
  showAlert(message) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }

  selectVehiculeImage() {
    // SELECT IMAGE FROM LIBRARY
    this.getPictureFromLibrary().then((imageData) => {

      // CROP SELECTED IMAGE
      //this.cropImage(imageData, 50, 300, 300).then((croppedImage) => {

        // CAST PATH OF CROPPED IMAGE TO BLOB IMAGE
        (<any>window).resolveLocalFileSystemURL(imageData, (res) => {
          res.file((resFile) => {
            var reader = new FileReader();
            reader.readAsArrayBuffer(resFile);
            reader.onloadend = (evt: any) => {
              var imgBlob = new Blob([evt.target.result], { type: 'image/jpeg' });
              console.log(imgBlob);

              // UPLOAD CROPPED IMAGE AS A BLOB
              try {
                this.uploadImage(imgBlob);
              }
              catch (err) {
                //this.showAlert("Se produjo un error al cargar la imagen");
              }
            }
          })
        }), (err) => {
          //this.showAlert("Se produjo un error al convertir la imagen");
        }
      }, (err) => {
        //this.showAlert("Se profujo un error al recortar la imagen");
      });

/*     }, (err) => {
      //this.showAlert("Se produjo un error al seleccionar la imagen");
    }); */

  }


  getPictureFromLibrary() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.NATIVE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    }
    return this.camera.getPicture(options);
  }

  cropImage(image: string, quality: number, targetHeight: number, targetWidth: number) {
    return this.crop.crop(image, { quality, targetHeight, targetWidth });
  }

  uploadImage(image: Blob) {
    let storageRef = firebase.storage().ref();
    let loading = this.loadingCtrl.create({
      content: 'Subiendo imagen, por favor espere...'
    });
    loading.present();
    let path = '/vehicles/' + 'Vehicle_' + this.uid;
    let iRef = storageRef.child(path);

    iRef.put(image).then((snapshot) => {
      loading.dismiss();
      this.user.vehiclePhotoURL = snapshot.downloadURL;
    });
  }

  getBackground(image) {
    console.log(`url(${image})`)
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

}