import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-loading-component',
  templateUrl: './loading-component.component.html',
  styleUrls: ["../tasks/tasks.page.scss",'./loading-component.component.scss'],
  imports: [IonicModule]
})
export class LoadingComponentComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
