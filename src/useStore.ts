import { create } from "zustand";
import { DocumentReference } from "firebase/firestore";

type MessageStore = {
  room: DocumentReference | null;
  setRoom: (room: DocumentReference | null) => void;
  roomName: string;
  setRoomName: (roomName: string) => void;
  roomNameLink: string;
  setRoomNameLink: (roomNameLink: string) => void;
  roomImage: string;
  setRoomImage: (roomImage: string) => void;
};

export const useRoomStore = create<MessageStore>((set) => ({
  room: null,
  setRoom: (room: DocumentReference | null) => set({ room }),
  roomName: "",
  setRoomName: (roomName: string) => set({ roomName }),
  roomNameLink: "",
  setRoomNameLink: (roomNameLink: string) => set({ roomNameLink }),
  roomImage: "",
  setRoomImage: (roomImage: string) => set({ roomImage }),
}));
