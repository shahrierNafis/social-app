import { create } from "zustand";
import { DocumentReference, QueryDocumentSnapshot } from "firebase/firestore";

type MessageStore = {
  room: DocumentReference | null;
  setRoom: (room: DocumentReference | null) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  room: null,
  setRoom: (room: DocumentReference | null) => set({ room }),
}));
