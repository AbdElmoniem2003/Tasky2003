import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/core/services/data.service';
import { FunctionsService } from 'src/core/services/functions.service';
<<<<<<< HEAD
=======

>>>>>>> 865af61c3778c4f8f8efeff3b6566d08a0a6a4bb


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


<<<<<<< HEAD
  async ngOnInit() {
     await this.funcService.handleStatusBar('dark', true)
  }
=======

  async ngOnInit() {
     await this.funcService.handleStatusBar('dark', true)
  }

>>>>>>> 865af61c3778c4f8f8efeff3b6566d08a0a6a4bb

  start() {
    this.navCtrl.navigateForward("/login")
  }

}
