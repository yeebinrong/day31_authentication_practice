import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements CanActivate {
  private token = ''

  constructor(private http:HttpClient, private router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.isLogin())
      return true
    return this.router.parseUrl('/error')
  }

  login(credentials):Promise<boolean> {
      this.token = ''
      return this.http.post<any>('/api/login', credentials, {observe: 'response'}).toPromise()
      .then(resp => {
        if (resp.status == 200) {
          this.token = resp.body.token
          this.router.navigate(['/main'])
        }
        return true
      })
      .catch(err => {
        console.error(err.error.message)
        return false
      })
  }

  isLogin () {
    return this.token != ''
  }
}
