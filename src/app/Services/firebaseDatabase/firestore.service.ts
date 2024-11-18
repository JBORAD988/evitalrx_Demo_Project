import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore,) {}

  createUser(userId: string, email: string): Promise<void> {
    return firstValueFrom(
      this.firestore.collection('evitalrx/manageUsers', ref => ref.where('email', '==', email))
        .get()
    ).then(querySnapshot => {
      if (querySnapshot.empty) {
        const userData = {
          userId,
          email,
          patients: [],
        };

        return this.firestore.collection('evitalrx/manageUsers').add(userData).then(docRef => {
          console.log("User created successfully with ID:", docRef.id);
        });
      } else {
        console.error('User with this email already exists');
        return Promise.resolve();
      }
    }).catch(error => {
      console.error('Error creating user:', error);
    });
  }

  getPatientsByEmail(email: string): Observable<any[]> {
    return this.firestore
      .collection('evitalrx/manageUsers', (ref) => ref.where('email', '==', email))
      .valueChanges();
  }

  async addPatientByEmail(email: string, patient: { id: string; name: string }): Promise<void> {


  }







  loadData() {
    return this.firestore.collection('employee', ref => ref.orderBy('srNo')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, data };
        })
      })
    )
  }
}
