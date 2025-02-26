import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/core/services/data.service';
import { FunctionsService } from 'src/core/services/functions.service';



@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
  standalone: false
})
export class StartPage implements OnInit {
  lazyImg: string = '../../../assets/imgs/start-img.png'
  rAImg: string = '../../../assets/imgs/Arrow - Right.png'

  constructor(private dataService: DataService,
    private navCtrl: NavController,
    private funcService:FunctionsService
  ) { }



  async ngOnInit() {
     await this.funcService.handleStatusBar('dark', true)
  }


  start() {
    this.navCtrl.navigateForward("/login")
  }

}
