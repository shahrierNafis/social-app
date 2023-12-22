import admin from "@/firebaseAdmin";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } }
) {
  if (!uid) {
    return Response.json({ error: "uid not provided" });
  }
  const data = await admin.auth().getUser(uid);
  const { displayName, photoURL, uid: _uid } = data;
  return Response.json({ displayName, photoURL, uid: _uid });
}
