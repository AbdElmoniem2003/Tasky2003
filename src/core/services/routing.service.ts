import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";


@Injectable({ providedIn: 'root' })

export class RoutingService {

  constructor(private route: ActivatedRouteSnapshot,private routerState: RouterStateSnapshot) {

  }



}
