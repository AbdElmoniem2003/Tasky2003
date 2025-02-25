import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavController, PopoverController, ToastOptions } from '@ionic/angular';
import { FunctionsService } from 'src/core/services/functions.service';
import { LogingService } from 'src/core/services/loging.service';
import { LoginResponse } from 'src/core/types/user';

import countriesData, { CountryData } from "country-codes-list/dist/countriesData"




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {

  lazyImg: string = 'assets/imgs/start-img.png'

  viewPassword: boolean = false;
  loginForm: FormGroup;

  countries = countriesData
  selectedCountry: CountryData
  viewCountriesCodes: boolean = false;


  constructor(private formBuilder: FormBuilder,
    private logingService: LogingService,
    private funcService: FunctionsService,
    private navCtrl: NavController,) { }



  async ngOnInit() {
    this.initializeForm()
    //render the selected country
    this.funcService.countrySubject.subscribe((value: CountryData) => {
      this.selectedCountry = value
    })
  }

  async login(data: { phone: string, password: string }) {

    this.logingService.login(data).subscribe(
      async (value: LoginResponse) => {
        this.logingService.setTokens(value)
        await this.logingService.storeUser()
        await this.navCtrl.navigateForward("/tasks")
        this.loginForm.reset()
      })
  }

  initializeForm() {
    this.loginForm = this.formBuilder.group({
      phone: '',
      password: ''
    })
  }


  async handleCountryCode() {
    this.funcService.openCountriesModal()
  }


  showPassword() {
    const password: HTMLInputElement = document.querySelector('#password input');
    this.viewPassword ? password.setAttribute('type', 'password') : password.setAttribute('type', 'text');
    this.viewPassword = !this.viewPassword
  }

  switch() {
    this.navCtrl.navigateForward('/register')
  }




}

