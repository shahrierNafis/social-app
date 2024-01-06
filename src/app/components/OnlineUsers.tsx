import User from "./User";
import CardSlider from "./CardSlider";
import { usePresenceStore } from "@/useStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
function OnlineUsers() {
  const [onlineUsers] = usePresenceStore((state) => [state.onlineUsers]);

  return (
    <>
      <div className="p-2 lg:p-4 mt-4 border-x md:m-2">
        <div className="text-green-300 text-2xl">Online Users</div>
        <Carousel
          opts={{
            dragFree: true,
            align: "start",
          }}
          className="border-y flex max-w-[100vw] justify-center items-center shadow rounded"
        >
          <CarouselPrevious className="left-0 shrink-0 z-50" />
          <CarouselContent className="">
            {onlineUsers.length === 0 ? (
              <div className="w-full h-32 flex items-center justify-center">
                No online users
              </div>
            ) : (
              onlineUsers.map((uid) => (
                <CarouselItem key={uid} className="basis-[16rem]">
                  <div className="p-1">
                    <User uid={uid} href={`/profile/${uid}`} />
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselNext className="z-50 right-0 shrink-0" />
        </Carousel>
      </div>
    </>
  );
}

export default OnlineUsers;
