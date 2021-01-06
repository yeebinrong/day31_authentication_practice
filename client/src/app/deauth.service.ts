import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanLeaveRoute {
  canILeave():boolean | Promise<boolean>
}

@Injectable()
export class DeauthService implements CanDeactivate<CanLeaveRoute> {
  canDeactivate(component: CanLeaveRoute, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (!component.canILeave()) {
      return confirm('Are you sure you wish to leave?')
    }
    return true  
  }
}
