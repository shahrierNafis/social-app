"use client";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Link from "next/link";
import { BiMessage } from "react-icons/bi";

function NavigationBar() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <BiMessage size={32} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link className="nav-link" href="/">
                Home
              </Link>
              {user ? (
                <>
                  <Link className="nav-link" href="/profile">
                    Profile
                  </Link>
                </>
              ) : (
                <Link className="nav-link" href="/sign-in">
                  Sign in
                </Link>
              )}{" "}
            </Nav>
          </Navbar.Collapse>
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
