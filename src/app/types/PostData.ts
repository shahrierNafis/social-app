import { Timestamp } from "firebase/firestore";

type PostData = {
  text: string;
  imageUrl?: string;
  timestamp: Timestamp;
  author: string;
  innerCommentsIDs: string[];
};
export default PostData;
