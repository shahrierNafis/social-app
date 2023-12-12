import admin from "@/firebaseAdmin";
import { v4 as uuidv4 } from "uuid";
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

  const roomId = uuidv4();
  admin
    .firestore()
    .collection("rooms")
    .doc(roomId)
    .set({
      members: [uid, req.uid],
    });

  admin
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("conversations")
    .doc(req.uid)
    .set({ roomId });
  admin
    .firestore()
    .collection("users")
    .doc(req.uid)
    .collection("conversations")
    .doc(uid)
    .set({ roomId });
  return Response.json({ roomId });
}
