import User from "./User";
import CardSlider from "./CardSlider";
import { usePresenceStore } from "@/useStore";
function OnlineUsers() {
  const [onlineUsers] = usePresenceStore((state) => [state.onlineUsers]);

  return (
    <>
      <CardSlider title={<Title />}>
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

  function Title() {
    return (
      <>
        <div className="text-green-300 text-2xl">Online Users</div>
      </>
    );
  }
}

export default OnlineUsers;
