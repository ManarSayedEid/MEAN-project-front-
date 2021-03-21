import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private SERVER_URL = environment.SERVER_URL;

    constructor() { }
    getUserDetails() {
        return localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null;
    }
    setDataInLocalStorage(variableName, data) {
        localStorage.setItem(variableName, data);
    }
    getToken() {
        return localStorage.getItem('token');
    }
    clearStorage() {
        localStorage.clear();
    }
}

