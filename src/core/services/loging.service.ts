import { Injectable, OnInit } from "@angular/core";
import { LoginClass, LoginResponse, LogoutClass, ProfileResponse, RefreshResponse, RegisterRespose, UserClass } from "../types/user";
import { from, Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { HttpClient, HttpEvent, HttpResponse } from "@angular/common/http";
import { Storage } from "@ionic/storage-angular";
import { DataService } from "./data.service";

const BASE_URL = environment.baseUrl

@Injectable({ providedIn: 'root' })

export class LogingService implements OnInit {


  constructor(private http: HttpClient,
    private dataService: DataService,
    private storageInstance: Storage,
    private storage: Storage) { }

  async ngOnInit() {
    const initializedStorage: Storage = await this.storageInstance.create()
    this.storage = initializedStorage
    await this.storage.create()
  }


  async storeUser() {
    await this.storage.create()
    this.profile().subscribe(async (value: ProfileResponse) => {
      await this.storage.set(environment.LOGGED_USER, value)
    })
  }
  async getStoredUser() {
    await this.storage.create()
    return await this.storage.get(environment.LOGGED_USER)
  }

  /* Register a user */
  register(user: UserClass) {
    return this.dataService.postData("auth/register", user)
  }


  /* Login a user */
  login(user: LoginClass) {
    return this.dataService.postData("auth/login", user)
  }


  /* Logout */
  logout() {
    let promise = new Promise((resolve, reject) => {
      const token = localStorage.getItem(environment.REFRESH_TOKEN)
      this.dataService.postData("auth/logout", { token: token })
        .subscribe(async (res) => {
          resolve(res)
          // delete stored tasks and stored files
          await this.dataService.deleteAllStored();
          await this.dataService.deleteDir()
        },
          (err) => reject(err))
    })
    return promise
  }


  /* Profile */
  profile() {
    return this.dataService.getData("auth/profile")
  }

  refreshToken() {
    const token: string = this.getRefreshToken()

    let promise = new Promise((resolve, reject) => {
      this.http.get<RefreshResponse>(environment.baseUrl + `auth/refresh-token?token=` + token)
        .pipe().subscribe({
          next: (res) => {
            localStorage.setItem(environment.ACCESS_TOKEN, res.access_token)
            resolve(res.access_token)
          },
          error: (err) => reject(err)
        })
    })
    return from(promise)
  }


  setTokens(user: LoginResponse | RegisterRespose) {
    localStorage.setItem(environment.ACCESS_TOKEN, user.access_token)
    localStorage.setItem(environment.REFRESH_TOKEN, user.refresh_token)
  }


  getRefreshToken() {
    return localStorage.getItem(environment.REFRESH_TOKEN)
  }

  getAccessToken() {
    return localStorage.getItem(environment.ACCESS_TOKEN)
  }




}

