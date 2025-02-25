import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartPageRoutingModule } from './start-routing.module';

import { StartPage } from './start.page';
import { LazyLoadImageModule } from 'ng-lazyload-image'


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    StartPageRoutingModule,
    LazyLoadImageModule,


  ],
  declarations: [StartPage]
})
export class StartPageModule { }
