import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private _AuthService: AuthService, private _Router:Router){}

  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6), Validators.maxLength(20)])
  });

  invalidLogin: string = '';

  login(formData:FormGroup){
    this._AuthService.login(formData.value).subscribe(
      {
        next: (res) => {
      if(res.token) { 
        localStorage.setItem('user', res.token);
        this._AuthService.saveCurrentUser();
      }
      this._Router.navigate(['/home'])
    }, 
    error: (err) => {
      this.invalidLogin = err.error.message;
    }
      }
    )
  }

}
