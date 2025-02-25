import { Injectable } from "@angular/core";
import { TaskClass, TaskResponse, uploadResponse } from "../types/task";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, take } from "rxjs";
import { environment } from "src/environments/environment";
import { FunctionsService } from "./functions.service";
import { DeleteFileOptions, Directory, Filesystem, MkdirOptions, ReaddirOptions, ReaddirResult, ReadFileOptions, ReadFileResult, RenameOptions, RmdirOptions, WriteFileOptions } from "@capacitor/filesystem"
import { Storage } from "@ionic/storage-angular";




@Injectable({ providedIn: 'root' })

export class DataService {

  // private storage: Storage;
  task: TaskResponse;
  tasks: TaskResponse[];
  baseUrl = environment.baseUrl


  constructor(
    private http: HttpClient,
    private functionsService: FunctionsService,
    private storage: Storage
  ) { }

  /* List of tasks */
  getData(endPoint: string) {
    return this.http.get(this.baseUrl + endPoint).pipe(
      take(1),
      catchError(async (error) => {
        await this.functionsService.dismissLoading()
        this.functionsService.handleErrors(error, 'error-toast');
        throw error
      }))
  }


  /* Create a task*/
  postData(endPoint: string, body: any) {
    return this.http.post(this.baseUrl + endPoint, body).pipe(
      take(1),
      catchError(async (error) => {
        await this.functionsService.dismissLoading()
        this.functionsService.handleErrors(error, 'error-toast');
        throw error
      }))

  }


  /* One Task */
  getOneTask(endPoint: string, id: string) {
    return this.http.get(this.baseUrl + endPoint + id).pipe(
      take(1),
      catchError(async (error) => {
        await this.functionsService.dismissLoading()
        this.functionsService.handleErrors(error, 'error-toast');
        throw error
      }))
  }


  /* Delete a task*/
  deleteData(endPoint: string, id: string) {
    return this.http.delete(this.baseUrl + endPoint + id).pipe(
      take(1),
      catchError(async (error) => {
        await this.functionsService.dismissLoading()
        this.functionsService.handleErrors(error, 'error-toast');
        throw error
      }))
  }

  /* Edit a task*/
  updateData(endPoint: string, body: any, id: string) {
    return this.http.put(this.baseUrl + endPoint + id, body).pipe(
      take(1),
      catchError(async (error) => {
        await this.functionsService.dismissLoading()
        this.functionsService.handleErrors(error, 'error-toast');
        throw error
      }))
  }


  async storeTaskData(tasks: TaskResponse[]) {
    await this.storage.set(environment.STORED_TASKS, tasks)
  }

  async getStoredTasks(): Promise<TaskResponse[]> {
    return await this.storage.get(environment.STORED_TASKS)
  }

  async getOneStored(_id: string | any): Promise<TaskResponse> {
    const taskPromise = new Promise<TaskResponse>(async (resolve, reject) => {
      await this.getStoredTasks().then((res) => {
        const desiredTask = res.find((t) => { return t._id == _id })
        resolve(desiredTask)
      })
    })
    return taskPromise
  };

  async deleteOneStoredTask(_id: string) {
    return await this.getStoredTasks().then((val: TaskResponse[]) => {
      return val = val.filter((t) => { return t._id !== _id })
    })
      .then(async (val: TaskResponse[]) => {
        await this.storeTaskData(val)
      })
  }

  async deleteAllStored() {
    this.storage.clear()
  }

  async updateOneStored(edittedTask: TaskResponse, _id: string) {
    return await this.getStoredTasks().then(async (tasks) => {
      const taskToUpdate = tasks.find((t) => { return t._id == _id })
      const updateIndex: number = tasks.indexOf(taskToUpdate)
      tasks[updateIndex] = edittedTask;
      await this.storeTaskData(tasks)
    })
  }




  /* Upload Image */
  uploadImage(endPoint: string, formData: FormData): Observable<uploadResponse> {
    return this.http.post<uploadResponse>(this.baseUrl + endPoint, formData).pipe(
      take(1),
      catchError(async (error) => {
        await this.functionsService.dismissLoading()
        this.functionsService.handleErrors(error, 'error-toast', 1000);
        throw error
      }))
  }

  async makeDir() {

    const writeDirOpts: MkdirOptions = {
      directory: Directory.Cache,
      path: `${environment.STORED_IMAGES}`,
      recursive: true
    }
    return await Filesystem.mkdir(writeDirOpts)
  }

  async saveImage(task: TaskClass | TaskResponse, imageBase64: string | any) {
    const writeOpts: WriteFileOptions = {
      directory: Directory.Cache,
      path: `${environment.STORED_IMAGES}/${task.title}_${task.desc}.png`,
      data: imageBase64,
      recursive: true
    }
    return await Filesystem.writeFile(writeOpts)
  }

  async deleteImageFile(task: TaskResponse) {
    const deleteOpts: DeleteFileOptions = {
      directory: Directory.Cache,
      path: `${environment.STORED_IMAGES}/${task.title}_${task.desc}.png`,
    }
    return await Filesystem.deleteFile(deleteOpts)
  }

  async readFile(task: TaskResponse) {
    const readOpts: ReadFileOptions = {
      directory: Directory.Cache,
      path: `${environment.STORED_IMAGES}/${task.title}_${task.desc}.png`,
    }
    return await Filesystem.readFile(readOpts)
  }

  async getFileUri(task: TaskResponse) {
    return await Filesystem.getUri({
      path: `${environment.STORED_IMAGES}/${task.title}_${task.desc}.png`,
      directory: Directory.Cache
    })
  }

  async readDir(): Promise<ReaddirResult> {
    const dirOpts: ReaddirOptions = {
      directory: Directory.Cache,
      path: `${environment.STORED_IMAGES}`
    }
    return await Filesystem.readdir(dirOpts)
  }

  async deleteDir(): Promise<void> {
    const removeDirOpts: RmdirOptions = {
      path: `${environment.STORED_IMAGES}`,
      directory: Directory.Cache,
      recursive: true
    }
    return await Filesystem.rmdir(removeDirOpts)
  }


  async updateSavedImage(oldTask: TaskResponse, newTask: TaskClass, newBase64: string) {
    if (oldTask.image) await this.readFile(oldTask).then(async (res: ReadFileResult) => {
      await this.deleteImageFile(oldTask);
      await this.saveImage(newTask, newBase64)
    })
  }

  async renameSavedImage(oldTask: TaskResponse, newTask: TaskClass) {
    const options: RenameOptions = {
      directory: Directory.Cache,
      from: `${environment.STORED_IMAGES}/${oldTask.title}_${oldTask.desc}.png`,
      to: `${environment.STORED_IMAGES}/${newTask.title}_${newTask.desc}.png`
    }
    return await Filesystem.rename(options)
  }




}
