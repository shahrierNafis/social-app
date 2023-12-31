import { auth } from "@/firebase";
import { signInAnonymously } from "firebase/auth";
import { useState } from "react";

function AnonymousButton() {
  const [loading, setLoading] = useState(false);
  return (
    <button
      onClick={() => {
        setLoading(true);
        signInAnonymously(auth);
      }}
      disabled={loading}
      className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md max-w-xs px-6 py-2 text-sm font-medium text-gray-800 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        className="h-6 w-6 mr-2"
        viewBox="8 0 80 80"
        enable-background="new 0 0 100 100"
        xmlSpace="preserve"
      >
        <g>
          <path d="M48.1,52.1c17.4,0,37.5-4,39.3-7.6S65,36.1,65,36.1c-5.8,2.7-17,2.7-17,2.7s-11.2,0-17-2.7c0,0-24.1,4.9-22.3,8.5   C10.6,48.1,30.2,52.1,48.1,52.1z" />
          <path d="M63.1,29.2c0,0-3.4-19.4-5.9-23.2c-2.5-3.8-6.3,4.5-10.2,4.5c-3.9,0-4.8-5.3-8.3-5.5c-3.6-0.2-7.1,24.2-7.1,24.2   S50,33.4,63.1,29.2z" />
          <path d="M31.5,53.3c0,0-1.6,7.4,8,7.6c0,0,3.7,0,5.6-3.3c0.6-1,1.5-1.6,2.7-1.6h0.4c1.1,0,2.1,0.6,2.7,1.6c1.9,3.3,5.6,3.3,5.6,3.3   c9.6-0.2,8-7.6,8-7.6c-4.4,1.5-11.3,1.4-13.7,1.3h0c-0.6,0-0.9,0-0.9,0c0,0,0,0,0,0l-3.8,0C46.2,54.5,36.9,55,31.5,53.3z" />
          <path d="M27.7,53.3l-7.4-1.1l-12.8,11c0.3,0,0.8,0,1.2,0c5.7,0,20.8,4.8,20.8,4.8l-8,6.9c6,1.2,24.9,11.3,24.9,11.3l1.8-6.6   C33.1,68.5,27.7,53.3,27.7,53.3z" />
          <path d="M92.6,62.9L77.1,52.1l-8.3,1.1c0.5,2.7-1.2,7.6-1.2,7.6C43.7,78.9,47.6,95,47.6,95C57.1,76.2,78,73.6,78,73.6l-9.5-4.5   C74.7,65.2,92.6,62.9,92.6,62.9z" />
        </g>
      </svg>
      {loading ? "processing..." : "Continue anonymously"}
    </button>
  );
}

export default AnonymousButton;
