import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {
  private token = ''

  constructor(private http:HttpClient) { }

  login(credentials):Promise<boolean> {
      this.token = ''
      return this.http.post<any>('/api/login', credentials, {observe: 'response'}).toPromise()
      .then(resp => {
        console.info(resp)
        if (resp.status == 200) {
          this.token = resp.body.token
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
