import admin from "@/firebaseAdmin";
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
      if (req.uid != decodedToken.uid) {
        return Response.json({ error: "invalid auth" });
      }
    })
    .catch((error) => {
      console.log(error);
    });

  if (!uid) {
    return Response.json({ error: "uid not provided" });
  }
  const data = await admin.auth().getUser(uid);

  return Response.json({ ...data });
}
