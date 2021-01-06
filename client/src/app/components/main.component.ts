import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CanLeaveRoute } from '../deauth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, CanLeaveRoute {
  // Form related variables
  form:FormGroup

  constructor(private fb:FormBuilder, private router:Router, private authSvc:AuthService) { }

  ngOnInit(): void {
    this.createForm();
  }

  // Handles the form when submit button is clicked
  async onSubmit() {
    // need to reset form before navigating else will be blocked by canILeave
    this.form.reset()
    this.router.navigate(['/'])
  }

  canILeave() {
    return (!this.form.dirty)
  }

/* -------------------------------------------------------------------------- */
//                    ######## PRIVATE FUNCTIONS ########
/* -------------------------------------------------------------------------- */

  // Generates the form
  private createForm () {
    this.form = this.fb.group({
      value: this.fb.control('randomvalue', [Validators.required]),
    })
  }
}
