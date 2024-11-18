import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Firestore, arrayUnion } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore, private authfire: AngularFireAuth) {}


async addPatient(patientId: string) {
  try {
    const user = await this.authfire.currentUser;

    if (user) {
      const userId = user.uid;

      const patientsDocRef = this.firestore
        .collection('users')
        .doc(userId)
        .collection('patients')
        .doc('patientList');

      await patientsDocRef.set(
        {
          patientIds: arrayUnion(patientId),
        },
        { merge: true }
      );

      console.log(`Patient ID ${patientId} added to the array successfully!`);
    } else {
      console.error('No user logged in!');
    }
  } catch (error) {
    console.error('Error adding patient ID:', error);
  }
}


async getPatientIds() {
  try {
    const user1 = await this.authfire.currentUser;

    if(user1) {
    localStorage.setItem('user', JSON.stringify(user1));
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user) {
      const userId = user.uid;

      // Reference the user's "patients" document
      const patientsDocRef = this.firestore
        .collection('users')
        .doc(userId)
        .collection('patients')
        .doc('patientList'); // Access the fixed document

      // Get the document snapshot
      const docSnapshot = await patientsDocRef.get().toPromise();

      // Check if the document exists
      if (docSnapshot?.exists) {
        const data = docSnapshot.data();
        return data?.['patientIds'] || []; // Return the patient IDs array or an empty array if undefined
      } else {
        console.log('No patient data found.');
        return [];
      }
    } else {
      console.error('No user logged in!');
      return [];
    }
  } catch (error) {
    console.error('Error fetching patient IDs:', error);
    return [];
  }
}




}
