import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
    private auth = inject(Auth);
    private firestore = inject(Firestore);

    login(email: string, password: string) {

        return signInWithEmailAndPassword(this.auth, email, password);
    }

   
}