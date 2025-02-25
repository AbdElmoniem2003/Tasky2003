import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Camera, ImageOptions, Photo } from '@capacitor/camera';
import { NavController, ToastOptions } from '@ionic/angular';
import { DataService } from 'src/core/services/data.service';
import { FunctionsService } from 'src/core/services/functions.service';
import { TaskClass, TaskResponse, uploadResponse } from 'src/core/types/task';
import { UserClass } from 'src/core/types/user';

import { CameraService } from 'src/core/services/camera.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
  standalone: false,
})
export class EditPage implements OnInit {


  updateForm: FormGroup;


  lAImg: string = '../../../assets/imgs/Arrow - Left.png'
  lazyImg: string = '../../../assets/imgs/lazy-img.png'
  loadingImage: string = '../../../assets/imgs/BBNI.gif'
  flagImg: string = '../../../assets/imgs/flag.png'
  dAImg: string = '../../../assets/imgs/Arrow - Down.png'
  calenderImg: string = '../../../assets/imgs/calendar.png'

  priorities: string[] = ['high', 'medium', 'low']
  cases: string[] = ['waiting', 'inprogress', 'finished']

  taskToUpdate: TaskResponse;
  image: Photo;
  user: UserClass;

  constructor(private dataService: DataService,
    private navCtrl: NavController,
    private funcService: FunctionsService,
    private currentRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cameraService: CameraService) { }



  async ngOnInit() {
    // await this.getUser()
    await this.getTaskToEdit()
  }

  ionViewWillEnter() {
    // this.initializeForm()
  }

  initializeForm(task: TaskResponse) {
    this.updateForm = this.formBuilder.group({
      title: task.title,
      status: task.status,
      desc: task.desc,
      priority: task.priority,
      dueDate: this.funcService.formateDate(task.createdAt)
    })
  }

  async getTaskToEdit() {
    await this.funcService.showLoading()
    this.currentRoute.paramMap.subscribe(async (param) => {
      const taskID: string = param.get('id');

      /* From Storage_Angular */
      this.taskToUpdate = await this.dataService.getOneStored(taskID);
      this.initializeForm(this.taskToUpdate)
      /* Get Cached Task Image */
      await this.dataService.readFile(this.taskToUpdate).then((file) => {
        this.taskToUpdate.image = this.cameraService.returnBase64(file.data);
      })
      await this.funcService.dismissLoading()

      /* From Api */
      // this.dataService.getOneTask("todos/", taskID).subscribe((value: TaskResponse) => {
      //   this.taskToUpdate = value
      //   this.initializeForm(this.taskToUpdate)
      // })
    })
  }



  async updateTask(taskEditted: TaskClass) {
    await this.funcService.showLoading()

    taskEditted.dueDate = new Date(taskEditted.dueDate)
    taskEditted.image = this.taskToUpdate.image
    const taskId = this.taskToUpdate._id

    let formData = new FormData();
    await this.handleImg(taskEditted, this.image).then(async (file) => {

      this.dataService.updateData('todos/', taskEditted, taskId).subscribe(async (res: TaskResponse) => {

        /* At user changes the image of the task  */
        if (this.image) {

          formData.append('image', file)
          this.dataService.uploadImage("upload/image", formData)
          const base64 = await this.cameraService.readFileAsBase64(file)
          await this.dataService.updateSavedImage(this.taskToUpdate, taskEditted, base64)

          /* At user didn't change the image of the task */
        } else if (!this.image && this.taskToUpdate.image) {
          await this.dataService.renameSavedImage(this.taskToUpdate, taskEditted)
        }
        /* At the user reset the image of the task */
        else {
          await this.dataService.deleteImageFile(this.taskToUpdate)
        }

        // reduce consummed storage of Storage-Angular
        res.image = ''
        await this.dataService.updateOneStored(res, this.taskToUpdate._id)
        const options: ToastOptions = {
          message: 'تم حفظ التعديلات بنجاح',
          cssClass: 'edit-toast'
        }
        await this.funcService.GeneralToast(options)
        await this.navCtrl.navigateBack('/tasks')
        await this.funcService.dismissLoading()
      }, (err) => {
        this.funcService.GeneralToast({ message: "Too Large Image", duration: 2500, cssClass: 'error-toast' })
      })
    })
  }

  async updateTaskImg() {
    this.cameraService.captureImage(this.taskToUpdate.image).then(async (img: Photo) => {
      if (img) {
        await this.funcService.showLoading()
        this.image = img;
        this.taskToUpdate.image = await this.cameraService.readImageAsBase64(img)
        await this.funcService.dismissLoading()
      } else {
        this.taskToUpdate.image = ''
      }
    })
  }

  backToTaskDetails() {
    this.navCtrl.navigateBack(`details/${this.taskToUpdate._id}`)
  }

  showPicker() {
    const date: HTMLInputElement = document.querySelector('#date')
    date.showPicker()
  }


  async handleImg(task: TaskClass, img: Photo): Promise<File> {
    // task image is uploaded using (this.image) and save to file storage Disk  =>  So no need to post its base64 also
    if (img) {
      const file = await this.cameraService.base64ToFile(img)

      return await this.cameraService.compressImage(file)
        .then(async (result) => {

          // assign the reduced image base64 data to the task image
          task.image = await this.cameraService.readFileAsBase64(result)

          if (result.size > 100000) {
            this.funcService.GeneralToast({ message: "Image Size Is Over 100 kB", cssClass: 'error-toast' })
            return null
          } else return result
        })
    } else {
      return null
    }
  }

}


