import React, {useState} from "react";
import {useDispatch} from "react-redux";
import { Badge, Button, ButtonGroup, Card, Col, Form, ListGroup, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import moment from 'moment-timezone';
import {config} from '../utils/Constants'
import {MarkAsRead} from "../actions/notificationAction";

const Notification = (props) => {
    
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState({
        loading: false,
        data: []
    })

    React.useEffect(() => {
        fetchNotification()
    }, [])

    const fetchNotification = async () => {
        setNotifications(prev => ({...prev, loading: true}));

        const res = await axios.get('notifications');

        let data = res.data.data;

        setNotifications(prev => ({...prev, data: data, loading: false}));

        dispatch(MarkAsRead())
    }

    const seeMoreNotification = async (link) => {
        setNotifications(prev => ({...prev, loading: true}))

        const res = await axios.get(link);

        let data = res.data.data;

        data.data = [...notifications.data.data, ...data.data];

        setNotifications(prev => ({...prev, data: data, loading: false}));
    }

    const renderNotifications = () => {

        if(notifications.loading) {
            return <ListGroup.Item>Loading...</ListGroup.Item>
        }

        if(notifications.data && notifications.data.data) {
            return notifications.data.data.map((notification, i) => {
                let time = moment.parseZone(timezoneConvert(notification.created_at)).format('x');
                time = getDayDiff(parseInt(time));
                let notif = notification.data;
                return <ListGroup.Item key={i}>
                    <Row>
                        <Col md="9" className="mb-0">{notif.title}</Col>
                        <Col md="3" className="mb-0 text-right">{time}</Col>
                    </Row>
                </ListGroup.Item>
            })
        } else {
            return <ListGroup.Item>No notifications.</ListGroup.Item>
        }
    }

    const timezoneConvert = (time) => {
        var userTz = moment.tz.guess(true);
        var time = moment.tz(time, config.url.TIMEZONE);

        return time.tz(userTz);
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

    return (
        <Row>
            <Col md="12">
                <Card>
                    <Card.Header>Notifications</Card.Header>
                    <ListGroup variant="flush">
                        {renderNotifications()}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )

}

export default Notification;