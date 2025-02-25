import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from "@angular/common/http";
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  Observable,
  throwError
} from "rxjs";
import { switchMap, take, map } from "rxjs/operators"
import { LogingService } from "../services/loging.service";
import { NavController } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Capacitor } from "@capacitor/core";
import { FunctionsService } from "../services/functions.service";


@Injectable()

export class AccessInterceptor implements HttpInterceptor {

  constructor(
    private logingService: LogingService,
    private navCtrl: NavController,
    private funcService: FunctionsService) { }

  intercept(req: HttpRequest<any>,
    next: HttpHandler)
    : Observable<HttpEvent<any>> {

    return this.addToken(req, next).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 401:         // unauthorized ===> refresh the access token
              if (req.url.includes("login") || req.url.includes("register")) return throwError(() => err)
              return this.handle401Error(req, next);

            case 403:         // Forbbiden    ===> refresh token is expired
              return this.logOut();

            default:
              return throwError(() => err);
          }
        } else {
          return throwError(() => err);
        }
      })
    )
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.logingService
      .refreshToken()
      .pipe(switchMap(() => { return this.addToken(req, next) }))
  }

  addToken(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let request = req.clone({
      setHeaders: {
        Authorization: "Bearer " + this.logingService.getAccessToken()
      },
    });
    return next.handle(request)
  }

  logOut() {
    this.logingService.logout().then(async () => {
      localStorage.removeItem(environment.REFRESH_TOKEN);
      localStorage.removeItem(environment.ACCESS_TOKEN);
      const webPlatform = Capacitor.getPlatform() === 'web';
      await this.navCtrl.navigateRoot(webPlatform ? '/start' : '/login');
    })
    return EMPTY
  }
}
