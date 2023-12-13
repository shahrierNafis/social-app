import { create } from "zustand";
import { DocumentReference } from "firebase/firestore";

type RoomSore = {
  room: DocumentReference | null;
  setRoom: (room: DocumentReference | null) => void;
  roomName: string;
  setRoomName: (roomName: string) => void;
  roomNameLink: string;
  setRoomNameLink: (roomNameLink: string) => void;
  roomImage: string;
  setRoomImage: (roomImage: string) => void;
};

export const useRoomStore = create<RoomSore>((set) => ({
  room: null,
  setRoom: (room: DocumentReference | null) => set({ room }),
  roomName: "",
  setRoomName: (roomName: string) => set({ roomName }),
  roomNameLink: "",
  setRoomNameLink: (roomNameLink: string) => set({ roomNameLink }),
  roomImage: "",
  setRoomImage: (roomImage: string) => set({ roomImage }),
}));
type PresenceStore = {
  onlineUsers: string[];
  setOnlineUsers: (OnlineUsers: string[]) => void;
};

export const usePresenceStore = create<PresenceStore>((set) => ({
  onlineUsers: [],
  setOnlineUsers: (onlineUsers: string[]) => set({ onlineUsers }),
}));
