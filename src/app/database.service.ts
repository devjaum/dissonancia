import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  query, 
  where, 
  collectionData,
  doc,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { Auth, authState } from '@angular/fire/auth';
import { Observable, of, switchMap, map } from 'rxjs';

export interface Character {
  id?: number; // Opcional, pois o Firestore tem seu próprio ID de documento
  email: string;
  name?: string;
  class: string;
  level: number;
  lore: string;
  inventory: number[]; // Firestore suporta arrays nativamente
  status: number[];
  talent: string[];
  skills: string[];
  equipment: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  // Busca o personagem baseado no EMAIL do usuário logado
  getCharacterByEmail(): Observable<Character | null> {
    return authState(this.auth).pipe(
      switchMap(user => {
        if (user && user.email) {
          // Define a coleção 'users' (ou o nome que você usou no Firestore)
          const usersCollection = collection(this.firestore, 'dissonancia-db');
          
          // Cria a query: "busque onde o campo 'email' for igual ao email do user"
          const q = query(usersCollection, where('email', '==', user.email));
          
          // Retorna os dados. O idField adiciona o ID do documento do Firestore ao objeto
          return collectionData(q, { idField: 'docId' }).pipe(
            map(chars => {
              // Como a query retorna um array, pegamos o primeiro item
              return chars.length > 0 ? (chars[0] as Character) : null;
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }
  async saveUserData(data: any){
    const user = this.auth.currentUser;
    if(user) {
      const userDocRef = doc(this.firestore, `dissonancia-db/${user.uid}`);
      return setDoc(userDocRef, data, {merge: true});
    }
    return null;
  }
  // Método para atualizar dados (ex: salvar nova build)
  async updateCharacter(docId: string, data: Partial<Character>) {
    const docRef = doc(this.firestore, 'dissonancia-db', docId);
    return updateDoc(docRef, data);
  }

  hasCharacter(email: string): Observable<boolean> {
    const usersCollection = collection(this.firestore, 'dissonancia-db');
    // Busca na coleção onde o campo 'email' é igual ao email passado
    const q = query(usersCollection, where('email', '==', email));
    
    return collectionData(q).pipe(
      map(chars => chars.length > 0) // Transforma o array de resultados em true/false
    );
  }

  adminViewPlayers(): Observable<any[]> {
    const usersCollection = collection(this.firestore, 'dissonancia-db');

    return collectionData(usersCollection, { idField: 'id' });
  }

  isAuthenticated(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => !!user)
    );
  }
  logout() {
    return this.auth.signOut();
  }

  isAdmin(): Observable<boolean> {
    return authState(this.auth).pipe(
      map(user => {
        // Verifica se o email do usuário está na lista de admins
        const adminEmails = 'admin@rpg.com';
        return user ? adminEmails.includes(user.email || '') : false;
        })
    );
  }
}