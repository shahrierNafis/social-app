import User from "./User";
import CardSlider from "./CardSlider";
import { usePresenceStore } from "@/useStore";
function OnlineUsers() {
  const [onlineUsers] = usePresenceStore((state) => [state.onlineUsers]);

  return (
    <>
      <CardSlider title="Online Users" titleClass="text-green-300 text-2xl">
        {onlineUsers?.length === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <span className="text-gray-400">{"No users online!"}</span>
          </div>
        ) : (
          onlineUsers?.map((uid) => {
            return <User key={uid} uid={uid} href={`/profile/${uid}`} />;
          })
        )}
      </CardSlider>
    </>
  );
}

export default OnlineUsers;
