import * as admin from "firebase-admin";

interface IProfile {
  username: string;
  points: number;
  win: number;
  lose: number;
  draw: number;
}

export class Profile {
  static firestore = admin.firestore(admin.initializeApp());
  static create(username: string, id: string): Promise<IProfile> {
    const newProfile = {
      username,
      points: 0,
      win: 0,
      lose: 0,
      draw: 0
    };
    return this.firestore
      .collection("profiles")
      .doc(id)
      .set(newProfile)
      .then(() => newProfile);
  }
}
