import { Component, OnInit } from '@angular/core';
import { ApiService } from './../../../services/api.service'
import { AuthService } from './../../../services/auth.service'
import {NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { threadId } from 'worker_threads';

@Component({
selector: 'app-register',
templateUrl: './register.component.html',
styleUrls: ['./register.component.css']
})

// const name=document.getElementById('name');
// const email=document.getElementById('email');

// const password=document.getElementById('pass');

// const confirmPass=document.getElementById('confirmPass');
// console.log(name)



export class RegisterComponent implements OnInit {
    name:String;
    email:String;
    password:String;
    confirmPass:String;
    registerVaalidate(){
        if(!this.name||!this.email||!this.password||!this.confirmPass){
            console.log("fill all fields")
        }
    
       console.log(this.name,this.email,this.password,this.confirmPass);

    }

isLogin: boolean = false
errorMessage
constructor(
private _api: ApiService,
private _auth: AuthService,
private _router:Router
) { }
ngOnInit() {
this.isUserLogin();
}
onSubmit(form: NgForm) {
console.log('Your form data : ', form.value);
if(!this.name||!this.email||!this.password||!this.confirmPass){
    alert("fill data")
}else{
    if(this.password!==this.confirmPass){
        alert("passwords dont match")

    }else{
this._api.postTypeRequest('/api/users/signup', form.value).subscribe((res: any) => {
if (res.status) {
console.log(res)
this._auth.setDataInLocalStorage('userData', JSON.stringify(res.data));
this._auth.setDataInLocalStorage('token', res.token);
console.log(res.token);
this._router.navigate(['login']);
} else {
console.log(res)
alert(res.msg)
}
}, err => {
    alert(err['error'].message)
this.errorMessage = err['error'].message;
});
}}}
isUserLogin(){
if(this._auth.getUserDetails() != null){
this.isLogin = true;
}
}
}