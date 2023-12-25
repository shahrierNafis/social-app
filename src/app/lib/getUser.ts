const cache: { [key: string]: User } = {};
export default async function getUser(uid: string) {
  if (cache[uid]) {
    return cache[uid];
  } else {
    cache[uid] = await (await fetch(`/profile/GET/${uid}`)).json();
    return cache[uid];
  }
}
export type User = {
  photoURL: string;
  displayName: string;
  uid: string;
};
