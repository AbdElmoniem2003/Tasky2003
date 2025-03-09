import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertOptions, NavController, ToastOptions } from '@ionic/angular';
import { CameraService } from 'src/core/services/camera.service';
import { DataService } from 'src/core/services/data.service';
import { FunctionsService } from 'src/core/services/functions.service';
import { TaskResponse } from 'src/core/types/task';
import { ProfileResponse } from 'src/core/types/user';
import { Printer, PrintOptions } from '@bcyesil/capacitor-plugin-printer';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: false
})
export class DetailsPage implements OnInit {

  lAImg: string = '../../../assets/imgs/Arrow - Left.png'
  lazyImg: string = '../../../assets/imgs/lazy-img.png'
  loadingImage: string = '../../../assets/imgs/BBNI.gif'
  calenderImg: string = '../../../assets/imgs/calendar.png'
  qrImg: string = '../../../assets/imgs/QBW.png'
  editMode: boolean = false

  currentTask: TaskResponse;
  user: ProfileResponse;


  constructor(private navCtrl: NavController,
    private currentRoute: ActivatedRoute,
    private funcService: FunctionsService,
    private dataService: DataService,
    private cameraService: CameraService
  ) { }

  async ngOnInit() {
    this.editMode = false
    await this.loadCurrentTask()
  }

  async ionViewWillEnter() {
    this.editMode = false;
    await this.loadCurrentTask()
  }

  async deleteTask(id: string) {
    this.editMode = !this.editMode

    const alertOptions: AlertOptions = {
      mode: 'ios',
      animated: true,
      message: 'هل تريد الحذف ؟ ',
      cssClass: 'delete-alert'
    }

    const toastOptions: ToastOptions = {
      message: 'تم الحذف بنجاح',
      mode: 'ios',
      cssClass: 'delete-toast',
      duration: 2000,
    }

    this.funcService.GeneralAlert(alertOptions).then(async (value: Boolean) => {
      if (!value) return;
      /* Delete From Api */
      await this.funcService.showLoading()
      this.dataService.deleteData("todos/", id).subscribe(async () => {
        await this.funcService.GeneralToast(toastOptions)
        await this.dataService.deleteOneStoredTask(id);
        await this.dataService.deleteImageFile(this.currentTask)
        this.navCtrl.navigateBack('/tasks')
        await this.funcService.dismissLoading()
      });

    })
  }


  async edit() {
    this.editMode = !this.editMode
    await this.navCtrl.navigateForward(`/edit/${this.currentTask._id}`)
  }


  async loadCurrentTask() {

    await this.funcService.showLoading()

    this.currentRoute.paramMap.subscribe(async (param) => {
      const taskID: string = param.get('id')

      /* From Storage_Angular */
      this.currentTask = await this.dataService.getOneStored(taskID)

      await this.dataService.readFile(this.currentTask).then((file) => {
        this.currentTask.image = this.cameraService.returnBase64(file.data)
      })
      await this.funcService.dismissLoading()

      /* From Api */
      // await this.dataService.getOneStored(taskID).then((t) => {
      //   if (t) {
      //     t.createdAt = this.funcService.formateDate(t.createdAt)
      //     console.log("From Stored");
      //     this.currentTask = t;
      //   } else {
      //     this.dataService.getOneTask("todos/", taskID)
      //       .subscribe((value: TaskResponse) => {
      //         value.createdAt = this.funcService.formateDate(value.createdAt)
      //         console.log("From Api");
      //         return this.currentTask = value
      //       })
      //   }
      // })
    })
  }

  async shareTask(task: TaskResponse) {
    this.editMode = !this.editMode
    await this.funcService.shareObject(task)
  }

  async printTask() {
    this.editMode = !this.editMode
    const printOpts: PrintOptions = {
      content: '',
    }
    await Printer.print(printOpts).then(() => console.log('Done')).catch(err => console.log(err, 'Failed'))
  }

  back() {
    this.navCtrl.navigateBack('/tasks')
  }

}
