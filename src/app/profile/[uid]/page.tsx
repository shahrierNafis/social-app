import MessageBtn from "@/app/components/MessageBtn";
import React from "react";

function page({ params }: { params: { uid: string } }) {
  return (
    <>
      <MessageBtn uid={params.uid} />
    </>
  );
}

export default page;
