import admin from "@/firebaseAdmin";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
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

  async function getUserList(searchResult: string[], nextPageToken?: string) {
    // List batch of users, 1000 at a time.
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

    listUsersResult.users.forEach((userRecord) => {
      searchResult.push(userRecord.uid);
    });
    if (listUsersResult.pageToken) {
      // List next batch of users.
      return getUserList(searchResult, listUsersResult.pageToken);
    } else {
      return searchResult;
    }
  }
  // Start listing users from the beginning, 1000 at a time.

  return Response.json(await getUserList([]));
}
