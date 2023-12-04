import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  Container,
  Nav,
  Navbar,
  NavDropdown,
  Overlay,
  Popover,
} from "react-bootstrap";
import "../css/notifications.css";
import { Bell, BellOff, BookOpen, AlertTriangle, Link } from "react-feather";

export default function NotificationMenu() {
  const ref = useRef(null);
  const [showCount, setShowCount] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const [listen, setListen] = useState(false);
  const hide = () => {
    setShow(false);
}
  return (
    <>
      <div className="notification-container">
        <div
          className={"notification notify show-count notification notify"}
          data-count={0}
          onClick={(event) => {}}
        >
          <Bell color="yellow" size="25" />
        </div>
      </div>

      <div>
        {/* <Overlay
          show={show}
          target={target}
          placement="bottom"
          container={ref.current}
          containerPadding={20}
          rootClose={true}
          onHide={hide}
        >
          <Popover id="popover-contained">
            <Popover.Title as="h3">Notifications</Popover.Title>
            <Popover.Content style={{ padding: "3px 3px" }}>
              {Boolean(showCount) && (
                <div>
                  <Button variant="link" onClick={(event) => markAsRead(event)}>
                    <BookOpen size={24} />
                    Mark all as read
                  </Button>
                </div>
              )}
              <ul className="notification-info-panel">
                {notifications.data &&
                notifications.data.data &&
                notifications.data.data.length > 0 ? (
                  notifications.data.data.map((message, index) => (
                    <li
                      className={
                        !message["read_at"]
                          ? "notification-message unread"
                          : "notification-message"
                      }
                      key={index}
                    >
                      <div className="timestamp">
                        <span>
                          {getDayDiff(
                            parseInt(
                              moment
                                .parseZone(message["created_at"])
                                .format("x")
                            )
                          )}
                        </span>
                        <span>{' ('}{getWhen(parseInt(moment.parseZone(message['created_at']).format('x')))}{')'}</span>
                      </div>
                      <div
                        className="content"
                        dangerouslySetInnerHTML={getContent(
                          message["data"]["title"]
                        )}
                      ></div>
                    </li>
                  ))
                ) : (
                  <>
                    <AlertTriangle color="#000000" size={32} />
                    <h5 className="nodata">No Notifications found!</h5>
                  </>
                )}
              </ul>
            </Popover.Content>
            <Popover.Title className="text-center">
              <Link to="/notifications">View All Notifications</Link>
            </Popover.Title>
          </Popover>
        </Overlay> */}
      </div>
    </>
  );
}
