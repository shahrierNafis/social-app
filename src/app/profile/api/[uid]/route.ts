import admin from "@/firebaseAdmin";
import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest,
  { params: { uid } }: { params: { uid: string } }
) {
  // const res = await request.json();
  //    admin.auth().verifyIdToken;
  const user = await admin.auth().getUser(uid);
  console.log(user);

  return Response.json({ user });
}
