import { Component, OnInit } from '@angular/core';
import { NavController, ToastOptions } from '@ionic/angular';
import { DataService } from 'src/core/services/data.service';
import { LogingService } from 'src/core/services/loging.service';
import { ProfileResponse, UserClass } from 'src/core/types/user';

import { Clipboard, WriteOptions } from '@capacitor/clipboard';
import { FunctionsService } from 'src/core/services/functions.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false
})
export class ProfilePage implements OnInit {

  lAImg: string = '../../../assets/imgs/Arrow - Left.png'

  currentUser: ProfileResponse;

  constructor(
    private logingService: LogingService,
    private navCtrl: NavController,
    private funcService: FunctionsService) { }

  async ngOnInit() {
    this.getRegisteredUser()
  }

  async getRegisteredUser() {
    // this.logingService.profile().subscribe((value: ProfileResponse) => {
    //   console.log(value);
    //   this.currentUser = value
    // })
    await this.logingService.getStoredUser().then((value: ProfileResponse) => this.currentUser = value)
  }


  async copyPhoneNumber() {
    const clibBoardOptions: WriteOptions = {
      string: this.currentUser.username,
    }
    Clipboard.write(clibBoardOptions);

    const toastOptions: ToastOptions = {
      message: `تم نسخ   ${this.currentUser.username} بنجاح  `,
      cssClass: "add-toast",
      buttons: []
    }
    await this.funcService.GeneralToast(toastOptions)
  }


  back() {
    this.navCtrl.navigateBack('/tasks')
  }

}
