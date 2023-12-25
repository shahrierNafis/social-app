"use client";
import React from "react";
import OnlineUsers from "@/app/components/OnlineUsers";
import SearchUsers from "@/app/components/SearchUsers";
function page() {
  return (
    <>
      <SearchUsers />
      <OnlineUsers />
    </>
  );
}

export default page;
