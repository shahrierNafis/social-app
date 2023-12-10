import { User } from "firebase/auth";

export default async function updateUser(
  user: User,
  displayName: string,
  photoURL?: string
) {
  if (displayName != user.displayName || photoURL != undefined) {
    return await (
      await fetch(`/profile/POST/${user.uid}`, {
        body: JSON.stringify({
          token: await user.getIdToken(),
          userData: {
            ...(displayName != user.displayName && { displayName }),
            ...(photoURL && { photoURL }),
          },
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
    ).json();
  }
}
