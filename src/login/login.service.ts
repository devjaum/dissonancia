//service
import { Injectable, Inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(@Inject(AngularFireAuth) private afAuth: AngularFireAuth) {}
    login(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password);
    }
}