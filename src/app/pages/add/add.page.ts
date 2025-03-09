import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Photo } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/core/services/data.service';
import { FunctionsService } from 'src/core/services/functions.service';
import { TaskClass, TaskResponse } from 'src/core/types/task';

import { CameraService } from 'src/core/services/camera.service';




@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  standalone: false,
})
export class AddPage implements OnInit {

  addForm: FormGroup
  image: Photo = null

  taskImg: string | any;
  lAImg: string = '../../../assets/imgs/Arrow - Left.png'
  flagImg: string = '../../../assets/imgs/flag.png'
  dAImg: string = '../../../assets/imgs/Arrow - Down.png'
  addImg: string = '../../../assets/imgs/add-img.png'
  calenderImg: string = '../../../assets/imgs/calendar.png'
  priorities: string[] = ['high', 'medium', 'low']

  constructor(
    private dataService: DataService,
    private navCtrl: NavController,
    private funcService: FunctionsService,
    private cameraService: CameraService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }
  // ionViewWillEnter() {
  //   this.initializeForm()
  // }

  initializeForm() {
    this.addForm = this.formBuilder.group({
      image: "",
      title: "",
      desc: "",
      priority: "low",
      dueDate: null,
    })
  }


  async addTaskImg() {
    await this.cameraService.captureImage(this.taskImg).then(async (img) => {
      if (img) {
        await this.funcService.showLoading()
        this.image = img;
        this.taskImg = await this.cameraService.readImageAsBase64(img)
      } else {
        this.taskImg = null;
        this.addForm.value.image = null
      }
      await this.funcService.dismissLoading()
    })
  }


  async addTask(task: TaskClass) {
    await this.funcService.showLoading()

    await this.handleImg(task, this.image).then(async (file) => {
      const formData = new FormData()
      formData.append('image', file);

      this.dataService.postData('todos/', task).subscribe(async (t: TaskResponse) => {
        this.dataService.uploadImage('upload/image', formData)

        // store the all tasks with image of "Path.png" to reduce memory consummed
        let tasksCloneArr = this.dataService.tasks;
        tasksCloneArr.push(t);
        t.image = ''
        await this.dataService.storeTaskData(tasksCloneArr)

        // save task image to device storage Disk " Cache "
        const base64 = await this.cameraService.readFileAsBase64(file)
        this.image ? await this.dataService.saveImage(task, base64) : null;
        await this.navCtrl.navigateBack('/tasks')
        await this.funcService.dismissLoading()
      })
    })
  }

  async handleImg(task: TaskClass, img: Photo): Promise<File> {
    // task image is uploaded using (this.image) and save to file storage Disk  =>  So no need to store its base64 also
    if (img) {
      const file = await this.cameraService.base64ToFile(img)

      return await this.cameraService.compressImage(file)
        .then(async (result) => {
          // assign the reduced image("file") base64 data to the task image
          task.image = await this.cameraService.readFileAsBase64(result);

          this.taskImg = task.image

          if (result.size > 100000) {
            this.funcService.GeneralToast({ message: "Too Large Image", cssClass: 'error-toast' })
            return null
          } else return result
        })
    } else {
      task.image = "Path.png";
      return null
    }
  }







  backToTasks() {
    this.navCtrl.navigateBack('/tasks')
  }

  showPicker() {
    const date: HTMLInputElement = document.querySelector('#date')
    date.showPicker();
  }

}

