interface IProfile {
  username: string;
  points: number;
  win: number;
  lose: number;
  draw: number;
}

export class Profile {
  static create(
    firestore: any,
    username: string,
    id: string
  ): Promise<void | IProfile> {
    const newProfile = {
      username,
      points: 0,
      win: 0,
      lost: 0,
      draw: 0
    };
    return firestore
      .collection("profiles")
      .doc(id)
      .set(newProfile)
      .then(() => newProfile);
  }
}
