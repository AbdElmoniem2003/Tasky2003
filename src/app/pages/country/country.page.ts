import { Component, OnInit } from '@angular/core';
import { IonPopover, ModalController, NavController } from '@ionic/angular';

import { FunctionsService } from 'src/core/services/functions.service';
import { CountryData } from 'country-codes-list/dist/countriesData';

@Component({
  selector: 'app-country',
  templateUrl: './country.page.html',
  styleUrls: ['./country.page.scss'],
  standalone: false,
})
export class CountryPage implements OnInit {

  searchText: string;

  constructor(private functionsService: FunctionsService,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
  ) {
  }

  countries: CountryData[]
  countriesClone: CountryData[]

  ngOnInit() {
  }

  async setCountry(country: CountryData) {
    this.functionsService.setCountry(country);
    await this.modalCtrl.dismiss()
  }

  filterCountries() {
    this.countries = this.countriesClone
    let countriesToFilter = this.countries
    this.countries = this.searchText ? countriesToFilter.filter((c) => {
      return ((
        "+" + c.countryCallingCode).includes(this.searchText.trim()) ||
        c.countryNameEn.toLowerCase().includes(this.searchText.trim().toLowerCase()) ||
        c.countryNameLocal.toLowerCase().includes(this.searchText.trim().toLowerCase()))
    }) : this.countriesClone

  }



}
