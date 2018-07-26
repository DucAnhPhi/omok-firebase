import * as admin from 'firebase-admin';

export default class Base {
  static firestore = admin.firestore(admin.initializeApp());
};