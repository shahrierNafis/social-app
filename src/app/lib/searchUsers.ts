"use server";
import admin from "@/firebaseAdmin";
export default async function searchUsers(
  quarry: string,
  searchResult: string[] = [],
  nextPageToken?: string
) {
  // List batch of users, 1000 at a time.
  const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);

  listUsersResult.users.forEach((userRecord) => {
    if (userRecord.displayName?.match(new RegExp(`.*${quarry}.*`, "i"))) {
      searchResult.push(userRecord.uid);
    }
  });
  if (listUsersResult.pageToken) {
    // List next batch of users.
    return searchUsers(quarry, searchResult, listUsersResult.pageToken);
  } else {
    return searchResult;
  }
}
