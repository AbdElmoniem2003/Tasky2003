import { Component, OnInit } from '@angular/core';
import { AlertOptions, InfiniteScrollCustomEvent, NavController, RefresherCustomEvent, RefresherEventDetail } from '@ionic/angular';
import { CameraService } from 'src/core/services/camera.service';
import { DataService } from 'src/core/services/data.service';
import { FunctionsService } from 'src/core/services/functions.service';
import { LogingService } from 'src/core/services/loging.service';
import { TaskClass, TaskResponse } from 'src/core/types/task';
import { LogoutClass, UserClass } from 'src/core/types/user';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: false,
})
export class TasksPage implements OnInit {

  logoutImg: string = '../../../assets/imgs/log-out.png'
  personImg: string = '../../../assets/imgs/person.png'
  taskCases: string[] = ['all', 'inprogress', 'waiting', 'finished']
  lazyImg: string = '../../../assets/imgs/lazy-img.png'
  qImg: string = '../../../assets/imgs/Q.png'
  isLoading: boolean = true;

  tasks: TaskResponse[] = [];
  tasksImgs: string[]
  skip: number = 1;
  caseSelected: string = 'all';

  user: UserClass

  constructor(private dataService: DataService,
    private logingService: LogingService,
    private navCtrl: NavController,
    private funcService: FunctionsService,
    private cameraService: CameraService
  ) { }

  async ngOnInit() {
    await this.funcService.handleStatusBar('light', true)
    await this.loadTasks(this.skip)
  }

  async ionViewWillEnter() {
    await this.loadTasks(this.skip)
  }

  async loadTasks(skip: number) {
    // From Stored Tasks Data
    this.isLoading = true
    if (await this.dataService.getStoredTasks()) {
      await this.dataService.getStoredTasks().then(async (res) => {
        await this.getTasksImgs(res)
        this.isLoading = false
        this.tasks = res
        this.dataService.tasks = this.tasks;
      })
    } else {
      // From Api " 1st Load "
      this.dataService.getData(`todos?page=${skip}`).subscribe(async (value: TaskResponse[]) => {

        // Save tasks images returned from Api at the  1st Load and get them
        value.forEach(async (t) => {
          await this.dataService.saveImage(t, t.image);
          // Save More Memory in Storage-Angular
          t.image = ""

          // assign the task image to tha data of its reapective file image in the device storage
          this.isLoading = false
          this.tasks = value
          await this.getTasksImgs(this.tasks)
          this.dataService.tasks = this.tasks;

          // in case the data somehow has got lost
          await this.dataService.storeTaskData(value)
        })


      }, (err) => this.funcService.GeneralToast({ message: err.error.message }))
    }
  }

  /* Get Cached Tasks Images */
  async getTasksImgs(tasks: TaskResponse[]) {
    tasks.forEach(async (t) => {
      await this.dataService.readFile(t).then((file) => {
        console.log(t.image);
        t.image = this.cameraService.returnBase64(file.data)
        console.log(t.image);
      })
    })
  }



  async filter(taskStatus: string) {
    await this.funcService.showLoading()
    this.caseSelected = taskStatus
    const searchSpans = document.querySelectorAll('[title="search-spans"]')
    const currentSearch = document.querySelector(`.${taskStatus}`)
    searchSpans.forEach((span) => span.classList.remove('selected'))
    currentSearch.classList.add('selected')

    this.filteringTask(taskStatus)
    await this.funcService.dismissLoading()
  }

  // filttering proccess
  async filteringTask(taskStatus: string) {
    let copyTasks = this.dataService.tasks
    if (taskStatus.toLowerCase() !== 'all') {
      return this.tasks = copyTasks.filter((t: TaskResponse) => {
        return t.status.toLowerCase() == taskStatus.toLowerCase()
      })
    } else {
      return this.tasks = this.dataService.tasks
    }

  }


  toAdd() {
    this.navCtrl.navigateForward('/add')
  }

  async logout() {

    const options: AlertOptions = {
      message: ('متاكد انك تريد تسجيل الخروج ؟؟'),
      cssClass: 'logout-alert',
      mode: "ios",
      animated: true
    }
    this.funcService.GeneralAlert(options).then((value: boolean) => {
      if (!value) return;
      this.logingService.logout().then(async (value: LogoutClass) => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        // await this.dataService.deleteData();
        this.navCtrl.navigateBack('/start')
      })
    })


  }

  toProfile() {
    this.navCtrl.navigateForward('/profile')
  }

  toDetails(task: TaskResponse) {
    this.navCtrl.navigateForward('details/' + task._id)
  }

  async refresh(event: RefresherCustomEvent) {
    this.skip = 1;
    this.filteringTask('all').then(async () => {
      await this.filter('all')
      event.target.complete()
    })
    await this.loadTasks(this.skip)
    await event.target.complete()

  }

  async loadMore(event: InfiniteScrollCustomEvent) {
    // this.skip += 1
    await event.target.complete()
    await this.loadTasks(this.skip)
  }


}
