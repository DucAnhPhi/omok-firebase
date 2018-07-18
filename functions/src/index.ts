import { updateProfileFunc } from "./profile";
import * as admin from "firebase-admin";

admin.initializeApp();
const firestore = admin.firestore();

export const updateProfile = updateProfileFunc(firestore);
