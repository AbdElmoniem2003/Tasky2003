import { Component, Injectable, OnInit } from '@angular/core';

import { SplashScreen } from "@capacitor/splash-screen"
import { StatusBar, Style } from '@capacitor/status-bar'
import { NavController, Platform } from '@ionic/angular';
import { FunctionsService } from 'src/core/services/functions.service';
import { LogingService } from 'src/core/services/loging.service';
import { ProfileResponse } from 'src/core/types/user';
import { Storage } from "@ionic/storage-angular"
import { environment } from 'src/environments/environment';
import { DataService } from 'src/core/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {

  user: ProfileResponse;

  constructor(
    private logingService: LogingService,
    private funcService: FunctionsService,
    private navCtrl: NavController,
    private dataService: DataService,
    private storage: Storage) {
  }

  async ngOnInit() {
    this.storage.create();
    await this.funcService.handleStatusBar('dark', true)
    // await this.funcService.requestPermissions().then(async () => {
      await this.CheckRegisterUsers();
    // })
    await this.dataService.makeDir()
  }



  async CheckRegisterUsers() {
    const refresh_token = localStorage.getItem(environment.REFRESH_TOKEN)
    await this.logingService.getStoredUser()
      .then(async (user: ProfileResponse) => {
        if (user && refresh_token) {
          await this.navCtrl.navigateForward('/tasks');
          await this.funcService.checkDarkThemes()
            .then(async (_) => {
              await SplashScreen.hide()
            })
        } else {
          await this.navCtrl.navigateForward('/start');
          await this.funcService.checkDarkThemes()
            .then(async (_) => {
              await SplashScreen.hide()
            })
        }
      });

  }


}
