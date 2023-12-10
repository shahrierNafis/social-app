import admin from "@/firebaseAdmin";
import { UserRecord } from "firebase-admin/auth";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } }
) {
  const req = await request.json();

  // verify that the user is authenticated
  await admin
    .auth()
    .verifyIdToken(req.token)
    .then((decodedToken) => {
      if (uid != decodedToken.uid) {
        return Response.json({ error: "invalid auth token" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
  // update user
  try {
    const userRecord = await admin.auth().updateUser(uid, {
      ...req.userData,
    });
    return Response.json({ userRecord });
  } catch (error) {
    console.log("Error updating user:", error);
    return Response.json({ error: "Error updating user" });
  }
}
