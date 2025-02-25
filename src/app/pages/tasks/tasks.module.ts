import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TasksPageRoutingModule } from './tasks-routing.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { TasksPage } from './tasks.page';
import { LoadingComponentComponent } from "../loading-component/loading-component.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TasksPageRoutingModule,
    LazyLoadImageModule,
    LoadingComponentComponent
],
  declarations: [TasksPage]
})
export class TasksPageModule { }
