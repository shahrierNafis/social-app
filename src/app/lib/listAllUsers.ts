"use server";
import admin from "@/firebaseAdmin";
export default async function listAllUsers() {
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

  return await getUserList([]);
}
