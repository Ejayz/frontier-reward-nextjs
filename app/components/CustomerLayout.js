import React from 'react';
import { NavLink, Link } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import _ from 'lodash';
import '../css/notifications.css'
import { config } from '../utils/Constants';
import NotificationMenu from './NotificationMenu';

export const CustomerHeader = (props) => {

    return (
        <Navbar collapseOnSelect className="sticky-top shadow-sm" expand="*" bg="light" variant="light">
            <Navbar.Brand className="col-sm-3 col-md-2 mr-0 px-3" href="#home">
            <img
                alt=""
                src={config.url.BASE_URL+'/icons/logo.png'}
                height="30"
                className="d-inline-block align-top"
            />
            </Navbar.Brand>

            <button className="navbar-toggler position-absolute d-md-none collapsed" type="button" data-toggle="collapse" data-target="#sidebarMenu" aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap notification-section">
                    <NotificationMenu/>
                </li>
                <li className="nav-item text-nowrap ml-3">
                    <Link className="nav-link logout-btn" onClick={ e => props.onLogout() }>Logout</Link>
                </li>
            </ul>
        </Navbar>
    );

}

export const CustomerSidebar = (props) => {

    return (
        
        <Navbar.Collapse id="sidebarMenu" className="col-md-4 col-lg-3 d-md-block bg-light sidebar collapse shadow">
            <div className="sidebar-sticky pt-3">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">
                            <img
                                alt="Dashboard"
                                src={config.url.BASE_URL+'/icons/dashboard-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Dashboard
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/rewards">
                            <img
                                alt="Rewards"
                                src={config.url.BASE_URL+'/icons/reward-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Rewards
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/campaigns">
                            <img
                                alt="Campaigns"
                                src={config.url.BASE_URL+'/icons/campaign-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Campaigns
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/transactions">
                            <img
                                alt="Transactions"
                                src={config.url.BASE_URL+'/icons/transaction-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Transactions
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/profile">
                            <img
                                alt="Profile"
                                src={config.url.BASE_URL+'/icons/profile-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Profile
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/settings">
                            <img
                                alt="Dashboard"
                                src={config.url.BASE_URL+'/icons/settings-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Settings
                        </NavLink>
                    </li>
                </ul>
            </div>
        </Navbar.Collapse>

    );

}
