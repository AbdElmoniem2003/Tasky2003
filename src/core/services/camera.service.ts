import { Injectable } from "@angular/core";
import { Camera, CameraResultType, CameraSource, ImageOptions, Photo } from "@capacitor/camera";
import { ActionSheetController } from "@ionic/angular";
import imageCompression, { Options } from "browser-image-compression";
import Compressor, { } from "compressorjs";
import { FunctionsService } from "./functions.service";


const camera: string = 'CAMERA'
const photos: string = 'PHOTOS'

@Injectable({ providedIn: 'root' })

export class CameraService {

  imgOptions: ImageOptions = {
    resultType: CameraResultType.Uri,
    quality: 80,
    saveToGallery: true,
  }



  constructor(
    private actionSheet: ActionSheetController,
    private funcService: FunctionsService

  ) { }

  async chooseCameraSource(oldBase64: string): Promise<string> {
    return new Promise<string>(async (resolve, reject) => {
      let actionScheet = await this.actionSheet.create({
        header: "Add or Edit the image of your task",
        mode: 'ios',
        cssClass: 'main-action-sheet',
        buttons: [{
          role: 'cancel',
          text: 'Cancel'
        }, {
          text: 'Camera',
          handler: () => resolve(camera)
        }, {
          text: 'Gallery',
          handler: () => resolve(photos)
        },
        (oldBase64) ? {
          text: 'Reset',
          handler: () => resolve('none')
        } : {
          text: 'Cancel', role: 'cancel'
        }
        ]
      })
      await actionScheet.present()
    })
  }

  async captureImage(oldBase64?: string): Promise<Photo> {
    return this.chooseCameraSource(oldBase64).then(async (value: string) => {
      if (value == camera) {
        this.imgOptions.source = CameraSource.Camera
        return await Camera.getPhoto(this.imgOptions)
      }
      else if (value == photos) {
        this.imgOptions.source = CameraSource.Photos
        return await Camera.getPhoto(this.imgOptions)
      } else {
        oldBase64 = '';
        return null
      }
    })
  }


  async compressImage(file: File | Blob | any): Promise<File> {
    let compressedFile: Promise<File> = new Promise((resolve, reject) => {
      try {
        if (file.size > 50000) {
          /*
            const options: Options = {maxSizeMB: 0.05 ,maxWidthOrHeight: 900,}
            compressedFile = imageCompression(file, options)
          */
          new Compressor(file, {
            quality: 0.6, convertSize: 100000, maxWidth: 500, maxHeight: 500,
            success(res: File) {
              resolve(res)
              console.log(1, res.size);
            },
            error(err) { reject(err) }
          })
        } else {
          /*
            options.maxSizeMB=1
            options.maxWidthOrHeight=1080
            compressedFile = imageCompression(file, options)
            */

          // for small-sized images
          new Compressor(file, {
            quality: 0.8,
            success(res: File) {
              resolve(res)
              console.log(2, res.size);
            },
            error(err) { reject(err) }
          })
        }
      } catch (err) {
        console.log(err.message);
      }
    })
    return compressedFile
  }




  // To Compress The Image
  async base64ToFile(img: Photo) {

    // correct the encoded base64
    let base64String: string = await this.readImageAsBase64(img)

    // Split the Base64 string to get the actual Base64 content
    const byteString = atob(base64String.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    const mime = base64String.split(',')[0].match(/:(.*?);/)[1];

    // Convert Base64 string to binary data
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }

    // Create a Blob and then a File
    const blob = new Blob([arrayBuffer], { type: mime });
    return new File([blob], `image_${Date.now()}.png`, { type: mime });
  }


  // to read the compressed image File and assign its value to the task image to reduce the size of uploaded task
  async readImageAsBase64(img: Photo) {
    const base64Promise = new Promise<string | ArrayBuffer | any>(async (resolve, reject) => {

      const response = await fetch(img.webPath)
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = async () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(blob)
    })
    return base64Promise;
  }

  async readFileAsBase64(file: File) {
    const promise = new Promise<any>(async (resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        resolve(reader.result)
      }
      reader.readAsDataURL(file)
    })
    return promise
  }

  returnBase64(data: string | any): string {
    return "data:image/jpeg;base64," + String(data)
  }



}





// const base64Response = await fetch("data:image/jpeg;base64," + this.image.base64String);
// const blob = await base64Response.blob()

