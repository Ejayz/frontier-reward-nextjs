import React from 'react';
import { Link, NavLink } from "react-router-dom";
import { Navbar } from "react-bootstrap";
import _ from 'lodash';
import { config } from '../utils/Constants';
import NotificationMenu from './NotificationMenu';

export const SuperAdminHeader = (props) => {

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
                <li className="nav-item text-nowrap">
                    <Link className="nav-link logout-btn" onClick={ e => props.onLogout() }>LOG OUT</Link>
                </li>
            </ul>
        </Navbar>
    );

}

export const SuperAdminSidebar = (props) => {

    return (
        
        <Navbar.Collapse id="sidebarMenu" className="col-md-4 col-lg-3 d-md-block bg-light sidebar collapse shadow">
            <div className="sidebar-sticky pt-3">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <NavLink exact={true} className="nav-link" to="/">
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
                        <NavLink className="nav-link" to="/actions">
                            <img
                                alt="Actions"
                                src={config.url.BASE_URL+'/icons/actions-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Actions
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/packages">
                            <img
                                alt="Packages"
                                src={config.url.BASE_URL+'/icons/package-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Packages
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
                        <NavLink className="nav-link" to="/users">
                            <img
                                alt="Profile"
                                src={config.url.BASE_URL+'/icons/profile-icon.png'}
                                width="26"
                                className="d-inline-block align-top"
                            />
                            Users
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
                    {/* <li className="nav-item">
                        <Link className="nav-link" to="/transactions">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-bar-chart-2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                        Settings
                        </Link>
                    </li> */}
                </ul>
            </div>
        </Navbar.Collapse>

    );

}
