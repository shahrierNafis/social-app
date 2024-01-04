import getUserSA from "./getUserSA";

const cache: { [key: string]: User } = {};

export default async function getUser(uid: string) {
  if (cache[uid]) {
    return cache[uid];
  } else {
    cache[uid] = await getUserSA(uid);
    return cache[uid];
  }
}
export type User = {
  photoURL: string;
  displayName: string;
  uid: string;
};
