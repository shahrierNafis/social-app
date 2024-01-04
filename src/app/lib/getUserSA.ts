"use server";
import admin from "@/firebaseAdmin";
import { User } from "./getUser";
export default async function getUserSA(uid: string) {
  const data = await admin.auth().getUser(uid);
  const { displayName, photoURL, uid: _uid } = data;
  return { displayName, photoURL, uid: _uid } as User;
}
