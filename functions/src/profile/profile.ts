import { Logger } from "../logger";

export class Profile {
  static async update(firestore: any, data: any, id: string): Promise<any> {
    const profileSnap = await firestore
      .collection("profiles")
      .doc(id)
      .get();
    const profile = this.buildProfile(data, profileSnap.exists);
    firestore
      .collection("profiles")
      .doc(id)
      .set(profile, { merge: true })
      .then(updated => {
        Logger.info("updatedProfile", `Updated profile ${id}`);
        return updated;
      })
      .catch(e => {
        Logger.error("update profile failed", e);
      });
  }

  static buildProfile(data, profileExists) {
    if (profileExists) {
      return {
        points: data.points,
        win: data.win,
        lose: data.lose,
        draw: data.draw
      };
    } else {
      return {
        username: data.username,
        points: 0,
        win: 0,
        lose: 0,
        draw: 0
      };
    }
  }
}
