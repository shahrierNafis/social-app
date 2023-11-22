"use client";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import Link from "next/link";
function NavigationBar() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
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
    </>
  );
}

export default NavigationBar;
