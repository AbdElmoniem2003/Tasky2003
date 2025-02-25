import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ToastOptions } from '@ionic/angular';
import { FunctionsService } from 'src/core/services/functions.service';
import { LogingService } from 'src/core/services/loging.service';
import { RegisterRespose, UserClass } from 'src/core/types/user';

import countriesData, { CountryData } from "country-codes-list/dist/countriesData"
import { CountryPage } from '../country/country.page';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage implements OnInit {

  lazyImg: string = 'assets/imgs/start-img.png'

  registerForm: FormGroup;
  viewPassword: boolean = false;

  countries = countriesData
  selectedCountry: CountryData

  constructor(private formBuilder: FormBuilder,
    private logingService: LogingService,
    private funcService: FunctionsService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.initializeForm();
    //render the selected country
    this.funcService.countrySubject.subscribe((value: CountryData) => {
      this.selectedCountry = value
    })
  }

  initializeForm() {
    this.registerForm = this.formBuilder.group({
      displayName: null,
      phone: null,
      experienceYears: null,
      level: null,
      address: null,
      password: null,
    })
  }

  showPassword() {
    const password: HTMLInputElement = document.querySelector('#password input');
    this.viewPassword ? password.setAttribute('type', 'password') : password.setAttribute('type', 'text');
    this.viewPassword = !this.viewPassword
  }

  register(user: UserClass) {
    this.addUserCountry(user)
    this.logingService.register(user).subscribe(
      async (value: RegisterRespose) => {
        this.logingService.setTokens(value);
        await this.logingService.storeUser()
        await this.navCtrl.navigateForward('/tasks')
        this.registerForm.reset()
      })
  }

  addUserCountry(user: UserClass) {
    const country = this.selectedCountry.countryNameEn;
    if (!user.address.includes(country)) {
      user.address + ` ${country}`
    }
  }

  switch() {
    this.navCtrl.navigateBack('/login')
  }

  async handleCountryCode() {
    this.funcService.openCountriesModal()
  }

}
