"use client";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import { BiMessage } from "react-icons/bi";
import { useRoomStore } from "@/useStore";
import { usePathname } from "next/navigation";
import Image from "next/image";
function NavigationBar() {
  const [user, loading, error] = useAuthState(auth);
  const [roomName] = useRoomStore((state) => [state.roomName]);
  const [roomNameLink] = useRoomStore((state) => [state.roomNameLink]);
  const [roomImage] = useRoomStore((state) => [state.roomImage]);
  const isInARoom = usePathname().includes("/room/");
  return (
    <>
      <Navbar className="bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <BiMessage size={32} />
          </Navbar.Brand>

          <Nav className="me-auto">
            <Link className="nav-link" href="/">
              Home
            </Link>
            {loading ? (
              <Link className="nav-link" href="#loading">
                loading
              </Link>
            ) : user ? (
              <>
                <Link className="nav-link" href="/profile">
                  Profile
                </Link>
              </>
            ) : (
              <Link className="nav-link" href="/sign-in">
                Sign in
              </Link>
            )}
          </Nav>
          {/* room info */}
          <Nav className="overflow-hidden max-h-28">
            {user && isInARoom && (
              <Link
                className="nav-link ml-auto text-white font-bold"
                href={roomNameLink}
              >
                <div className="  flex items-center flex-row">
                  <div className="flex relative items-center justify-center h-8 w-8 rounded-full  flex-shrink-0">
                    <Image
                      className="rounded-full h-full w-full bg-gray-600"
                      src={roomImage || ""}
                      alt=""
                      fill
                    />
                  </div>
                  {roomName}
                </div>
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      {loading && (
        <>
          <div className="flex items-center justify-center vh-100 vw-100 fixed top-0 left-0 z-50 bg-gray-600 bg-opacity-95 text-white font-bold">
            Loading...
          </div>
        </>
      )}
    </>
  );
}

export default NavigationBar;
