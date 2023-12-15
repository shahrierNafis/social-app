import admin from "@/firebaseAdmin";
import { UserRecord } from "firebase-admin/auth";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params: { quarry } }: { params: { quarry: string } }
) {
  // // verify that the user is authenticated
  // await admin
  //   .auth()
  //   .verifyIdToken(req.token)
  //   .then((decodedToken) => {
  //     if (req.uid != decodedToken.uid) {
  //       return Response.json({ error: "invalid auth" });
  //     }
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  async function searchUsers(searchResult: string[], nextPageToken?: string) {
    // List batch of users, 1000 at a time.
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

    listUsersResult.users.forEach((userRecord) => {
      if (userRecord.displayName?.match(new RegExp(`.*${quarry}.*`, "i"))) {
        searchResult.push(userRecord.uid);
      }
    });
    if (listUsersResult.pageToken) {
      // List next batch of users.
      return searchUsers(searchResult, listUsersResult.pageToken);
    } else {
      return searchResult;
    }
  }
  // Start listing users from the beginning, 1000 at a time.

  return Response.json(await searchUsers([]));
}
