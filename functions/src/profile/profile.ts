import * as admin from "firebase-admin";
interface IProfile {
  username: string;
  points: number;
}

export class Profile {
  static firestore = admin.firestore(admin.initializeApp());
  static create(username: string, id: string): Promise<IProfile> {
    const newProfile = {
      username,
      points: 1500
    };
    return this.firestore
      .collection("profiles")
      .doc(id)
      .set(newProfile)
      .then(() => newProfile);
  }
}
