import { User } from "firebase/auth";

export default async function getUser(user: User, uid: string) {
  if (user.uid == uid) {
    return user;
  }
  return await (
    await fetch(`/profile/GET/${uid}`, {
      body: JSON.stringify({
        token: await user.getIdToken(),
        uid: user.uid,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    })
  ).json();
}
