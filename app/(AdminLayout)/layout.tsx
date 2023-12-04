"use client";

import "../css/App.css";
import "../css/style.css";
import "bootstrap/dist/css/bootstrap.css";
import "../css/notifications.css";
import { SuperAdminSidebar } from "../components/SuperAdminLayout";
import { Navbar } from "react-bootstrap";
import Link from "next/link";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar
          collapseOnSelect
          className="sticky-top shadow-sm"
          expand="*"
          bg="light"
          variant="light"
        >
          <Navbar.Brand className="col-sm-3 col-md-2 mr-0 px-3" href="#home">
            <img
              alt=""
              src={"/icons/logo.png"}
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <button
            className="navbar-toggler position-absolute d-md-none collapsed"
            type="button"
            data-toggle="collapse"
            data-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap notification-section">
              {/* <NotificationMenu/> */}
            </li>
            <li className="nav-item text-nowrap">
              <Link className="nav-link logout-btn" href={""}>
                LOG OUT
              </Link>
            </li>
          </ul>
        </Navbar>
        <SuperAdminSidebar />
        {children}
      </body>
    </html>
  );
}
