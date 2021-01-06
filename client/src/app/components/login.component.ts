import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // Form related variables
  form:FormGroup
  hide:boolean = true // hide password

  constructor(private fb:FormBuilder, private apiSvc:ApiService, private authSvc:AuthService) { }

  ngOnInit(): void {
    this.createForm();
  }

  // Handles the form when submit button is clicked
  async onSubmit() {
    // this.apiSvc.postLogin(this.form.value)
    this.authSvc.login(this.form.value)
    .then (bool => {
      console.info(bool)
    })
  }

/* -------------------------------------------------------------------------- */
//                    ######## PRIVATE FUNCTIONS ########
/* -------------------------------------------------------------------------- */

  // Generates the form
  private createForm () {
    this.form = this.fb.group({
      username: this.fb.control('betty', [Validators.required]),
      password: this.fb.control('betty', [Validators.required]),
    })
  }
}