import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from "react-redux";
import { Link, Route, Redirect } from "react-router-dom";
import { Button, Container, Nav, Navbar, NavDropdown, Overlay, Popover } from "react-bootstrap";
import axios from 'axios';
import _ from 'lodash';
import '../css/notifications.css'
import NotifyMe from 'react-notification-timeline';
import moment from 'moment-timezone';
import { config } from '../utils/Constants';
import { Bell, BellOff, BookOpen, AlertTriangle } from 'react-feather';
import {AddData, DeleteData, EditData, GetData, MarkAsRead} from "../actions/notificationAction";

const NotificationMenu = (props) => {

    // State variabls
    const dispatch = useDispatch();
    const [showCount, setShowCount] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [listen, setListen] = useState(false)

    // Useref for the overlay
    const ref = useRef(null);

    // const [notifications, setNotifications] = useState({
    //     loading: false,
    //     data: []
    // })
    const auth = useSelector(state => state.Auth);
    const notifications = useSelector(state => state.Notification);

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {

        processNotification()
        
    }, [notifications])

    const fetchData = (url = '/notifications') => {

        dispatch(GetData(props, url));

    }

    console.log('notification', notifications);

    const processNotification = async () => {
        if(notifications.data && notifications.data.data) {
            let data = notifications.data.data;
    
            setMessageCount(notifications.count);
            setShowCount(notifications.count);
            
            if(!listen) initEcho()
        }
    }

    // Start Laravel Echo

    const initEcho = () => {
        window.Echo.private('App.Models.User.' + auth.user.id)
        .notification((notification) => {
            let newNotification = {
                'data' : {
                    'data': notification.data,
                    'title': notification.title
                },
                'created_at': moment().format()
            }

            dispatch({
                type: "NOTIFICATION_ADD",
                payload: newNotification
            })
            // console.log('notifications', {...notifications.data, data: [newNotification, ...notifications.data.data]});
            // setNotification(notification)
            // console.log('notif', notification);
    
            // let data = [...notification.data, newNotification];
    
            // setNotifications(prev => ({...prev, data: data}))
        });

        setListen(true);
    }

    // End Laravel Echo

    // const seeMoreNotification = async (link) => {
    //     setNotifications(prev => ({...prev, loading: true}))

    //     const res = await axios.get(link);

    //     let data = res.data.data;

    //     data.data = [...notifications.data.data, ...data.data];

    //     setNotifications(prev => ({...prev, data: data, loading: false}));
    // }

    const hide = () => {
        setShow(false);
    }

    // Handle the click on the notification bell
    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    }

    // Calculate the day diff
    const getDayDiff = timestamp => {
        let a = moment();
        let b = moment(timestamp);
        let diff = a.diff(b, 'year');
        if (diff === 0) {
            diff = a.diff(b, 'month');
            if (diff === 0) {
                diff = a.diff(b, 'days');
                if (diff === 0) {
                    diff = a.diff(b, 'hour');
                    if (diff === 0) {
                        diff = a.diff(b, 'minute');
                        if (diff === 0) {
                            diff = a.diff(b, 'second');
                            return `${diff} second(s) ago`;
                        } else {
                            return `${diff} minute(s) ago`;
                        }
                    } else {
                        return `${diff} hour(s) ago`;
                    }
                } else {
                    return `${diff} days(s) ago`;
                }
            } else {
                return `${diff} month(s) ago`;
            }
        } else {
            return `${diff} year(s) ago`;
        }
    };

    const getWhen = timestamp => {
        let when = `${moment(timestamp).format('L')} ${moment(timestamp).format('LTS')}`;
        return when;
    }
    
    // Get the notification message
    const getContent = message => {
        if (message.indexOf('\n') >= 0) {
            let splitted = message.split('\n');
            let ret = '<ul>';

            for (let i = 0; i <= splitted.length - 1; i++) {
                if (splitted[i] !== '') {
                    ret = ret + '<li>' + splitted[i] + '</li>';
                }
            }

            ret = ret + '</ul>';
            return {
                __html: ret
            };
        }
        return {
            __html: `<ul><li>${message}</li></ul>`
        };
    };

    const markAsRead = async (event) => {
        dispatch(MarkAsRead())
    }

    return (
        <>
        <div className="notification-container">
            <div className={showCount ? 'notification notify show-count' : 'notification notify'}
                data-count={messageCount}
                onClick={event => handleClick(event)}>
                <Bell color="yellow" size="25" />
            </div>
        </div>

        <div ref={ref}>
            <Overlay
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
                    <Popover.Content style={{ padding: '3px 3px' }}>
                        {Boolean(showCount) && <div>
                            <Button variant="link" onClick={event => markAsRead(event)}>
                                <BookOpen size={24} />
                                Mark all as read
                            </Button>
                        </div>
                        }
                        <ul className="notification-info-panel">
                            {
                                notifications.data && notifications.data.data && notifications.data.data.length > 0 ?
                                
                                notifications.data.data.map((message, index) =>
                                    <li
                                        className={!message['read_at'] ? 'notification-message unread' : 'notification-message'}
                                        key={index}>
                                        <div className="timestamp">
                                            <span>{getDayDiff(parseInt(moment.parseZone(message['created_at']).format('x')))}</span>
                                            {/* <span>{' ('}{getWhen(parseInt(moment.parseZone(message['created_at']).format('x')))}{')'}</span> */}
                                        </div>
                                        <div className="content" dangerouslySetInnerHTML={getContent(message['data']['title'])}></div>
                                    </li>
                                ) :
                                <>
                                    <AlertTriangle color='#000000' size={32} />
                                    <h5 className="nodata">No Notifications found!</h5>
                                </>
                            }
                        </ul>
                    </Popover.Content>
                    <Popover.Title className="text-center">
                        <Link to="/notifications">View All Notifications</Link>
                    </Popover.Title>
                </Popover>
            </Overlay>
        </div>
        </>
    );

}

export default NotificationMenu;