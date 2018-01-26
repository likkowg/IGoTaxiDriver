import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { RegisterPage } from '../register/register';

/**
 * Generated class for the LoginHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login-home',
  templateUrl: 'login-home.html',
})
export class LoginHomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginHomePage');
  }

  ToLogin() {
    this.navCtrl.push(LoginPage);
  }

  ToRegister() {
    this.navCtrl.push(RegisterPage);
  }

}
