import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { HomePage } from "../home/home";
import { AuthService } from "../../services/auth-service";
import { IonicPage } from 'ionic-angular/navigation/ionic-page';

/*
 Generated class for the RegisterPage page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  email: any;
  password: any;
  name: any;
  plastname: any;
  mlastname: any;

  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  signup() {
    if (!this.email || !this.password || !this.name) {
      let alert = this.alertCtrl.create({
        message: 'Por favor proporcione todos los datos solicitados',
        buttons: ['OK']
      });
      return alert.present();
    }

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.authService.register(this.email, this.password, this.name).subscribe(authData => {
      loading.dismiss();
      this.nav.setRoot(HomePage);
    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: ['OK']
      });
      alert.present();
    });
  }

  login() {
    this.nav.pop();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook().subscribe(authData => {
      this.nav.setRoot(HomePage);
    }, error => {
      // in case of login error
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: ['De acuerdo']
      });
      alert.present();
    });
  }

  // login with google
  loginWithGoogle() {
    this.authService.loginWithGoogle().subscribe(authData => {
      this.nav.setRoot(HomePage);
    }, error => {
      // in case of login error
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: ['De acuerdo']
      });
      alert.present();
    });
  }

}
