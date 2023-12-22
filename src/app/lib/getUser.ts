export default async function getUser(uid: string) {
  return await (await fetch(`/profile/GET/${uid}`)).json();
}
export type User = {
  photoURL: string;
  displayName: string;
  uid: string;
};
