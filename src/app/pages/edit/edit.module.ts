import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { EditPage } from './edit.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    EditPageRoutingModule,
    LazyLoadImageModule
  ],
  declarations: [EditPage]
})
export class EditPageModule { }
