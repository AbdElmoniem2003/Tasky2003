import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StatusBar, Style } from "@capacitor/status-bar";
import { AlertController, AlertOptions, ModalController, ToastController, ToastOptions } from "@ionic/angular";

import countries, { CountryData } from 'country-codes-list/dist/countriesData';
import { BehaviorSubject } from "rxjs";
import { CountryPage } from "src/app/pages/country/country.page";

import { Share, ShareOptions } from "@capacitor/share"
import { TaskResponse } from "../types/task";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { environment } from "src/environments/environment";
import { Camera } from "@capacitor/camera";



@Injectable({ providedIn: 'root' })



export class FunctionsService {


  constructor(private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
  ) {
    this.setCountry(null)
  }

  /* General Functions */

  // General Toast for Operations
  async GeneralToast(options: ToastOptions): Promise<any> {
    let toast = await this.toastCtrl.create({
      message: options.message,
      cssClass: options.cssClass,
      color: 'primary',
      mode: options.mode || 'ios',
      duration: options.duration || 1500,
      position: options.position || 'top',
      buttons: options.buttons || [{
        text: '.حسنا', role: 'cancel'
      }]
    })
    await toast.present()
  }


  // General alert for deleting or logging out
  async GeneralAlert(options: AlertOptions): Promise<boolean> {

    return new Promise(async (resolve) => {
      const alert = await this.alertCtrl.create({
        message: options.message,
        header: options.header,
        cssClass: options.cssClass,
        mode: options.mode || 'ios',
        buttons: options.buttons ?
          options.buttons : [
            {
              text: 'لا',
              role: 'cancel',
              handler: () => { resolve(false) }
            }, {
              text: "نعم",
              handler: () => { resolve(true) }
            }
          ]
      })
      await alert.present()
    })
  }



  handleErrors(err: HttpErrorResponse, classes: string, duration?: number) {
    this.GeneralToast({ message: err.status == 0 ? "تحقق من اتصالك بالانترنت" : err.error?.message, cssClass: classes, duration: duration || 2500 })
  }


  userCountry: CountryData = countries.find((c) => { return c.countryNameEn.toLowerCase() == 'egypt' })
  countrySubject = new BehaviorSubject<CountryData>(this.userCountry)
  setCountry(country: CountryData) {
    return country ? this.countrySubject.next(country) : this.countrySubject.next(this.userCountry)
  }

  async openCountriesModal() {
    let modal = await this.modalCtrl.create({
      cssClass: 'country-code',
      component: CountryPage,
      componentProps: { countries: countries, countriesClone: countries }
    })

    await modal.present()
  }

  async handleStatusBar(style: string, overlay: boolean) {
    StatusBar.setStyle({
      style: (style.toLowerCase() == 'dark') ? Style.Dark : Style.Light
    })
    StatusBar.setOverlaysWebView({ overlay: overlay })
  }


  async checkDarkThemes() {

    const checkDarkOrLight = window.matchMedia('(prefers-color-scheme: dark)');

    // activate dark if dark is the default
    checkDarkOrLight.matches ? this.activateDarkThemes(checkDarkOrLight.matches) : null;

    // change themes by changing system themes
    checkDarkOrLight.addEventListener(('change'), (media) => {
      this.activateDarkThemes(media.matches)
    })
  }

  activateDarkThemes(themeCase: boolean) {
    document.body.classList.toggle('dark', themeCase);
    this.handleStatusBar(themeCase ? 'dark' : 'light', true)
  }

  formateDate(dateToFormate: string) {
    const date = new Date(dateToFormate);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);    // Add leading zero at one digit gotten
    const day = ("0" + date.getDate()).slice(-2);             // Add leading zero at one digit gotten
    return `${year}-${month}-${day}`;                         // should return year-month-day to render the result in an input ot tyoe date
  }

  async showLoading() {
    const loadingParent = document.createElement('div');
    loadingParent.classList.add('loading-parent');
    const loadParagraph = document.createElement("p");
    loadParagraph.textContent = "Loading..... ";
    const loadingImg = document.createElement('img');
    loadingImg.src = "../../assets/imgs/BBNI.gif";
    loadingParent.appendChild(loadingImg);
    loadingParent.appendChild(loadParagraph);
    document.body.append(loadingParent)
  }

  async dismissLoading() {
    (document.body.querySelector('.loading-parent')) ? document.body.querySelector('.loading-parent').remove() : null
  }


  async shareObject(obj: TaskResponse|any) {

    const file = await Filesystem.getUri({
      path: `${environment.STORED_IMAGES}/${obj.title}_${obj.desc}.png`,
      directory: Directory.Cache
    })
    const options: ShareOptions = {
      title: 'Share Task',
      dialogTitle: 'Share Operation',
      text: `title: ${obj.title}` + "\n" + `describtion: ${obj.desc}`,
      url: file.uri,
    }
    await Share.share(options)
  }


  async requestPermissions() {
    await Camera.requestPermissions();
    await Filesystem.requestPermissions();
  }





}
