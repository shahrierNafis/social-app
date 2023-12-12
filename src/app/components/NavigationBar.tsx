"use client";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import { BiMessage } from "react-icons/bi";
import { useRoomStore } from "@/useStore";
import { usePathname } from "next/navigation";

function NavigationBar() {
  const [user, loading, error] = useAuthState(auth);
  const [roomName] = useRoomStore((state) => [state.roomName]);
  const [roomNameLink] = useRoomStore((state) => [state.roomNameLink]);
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
            {user && isInARoom && (
              <Link className="nav-link" href={roomNameLink}>
                {roomName}
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
