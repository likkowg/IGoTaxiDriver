import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController} from 'ionic-angular';
import { AuthService } from '../../services/auth-service';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  email: any;
  password: any;

  constructor(public nav: NavController, public authService: AuthService, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, private menuController: MenuController) {

  }

  // go to signup page
  signup() {
    this.nav.push(RegisterPage);
  }

  // go to login page
  login() {
    if (!this.email || !this.password) {
      let alert = this.alertCtrl.create({
        message: 'Por favor, proporcione un Email y contraseña',
        buttons: ['De acuerdo']
      });
      return alert.present();
    }

    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
    loading.present();

    this.authService.login(this.email, this.password).then(authData => {
      loading.dismiss();
      this.nav.setRoot(HomePage);
    }, error => {
      loading.dismiss();
      let alert = this.alertCtrl.create({
        message: error.message,
        buttons: ['De acuerdo']
      });
      alert.present();
    });
  }

  // login with facebook
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

  ionViewWillEnter() {
    this.menuController.enable(false);
    //this.navCtrl.swipeBackEnabled = false;
  }

  ionViewWillLeave() {
    this.menuController.enable(true);
    //this.navCtrl.swipeBackEnabled = true;
  }

}
