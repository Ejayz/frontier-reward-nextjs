import React, {useState} from "react";
import { useSelector } from "react-redux";
import { Button, Card, Carousel, Col, Row } from 'react-bootstrap';
import Chart from "react-apexcharts";
import axios from 'axios';
import { config } from '../utils/Constants';

const Dashboard = (props) => {

    const auth = useSelector(state => state.Auth);
    const [campaigns, setCampaigns] = useState(0);
    const [actions, setActions] = useState(0);
    const [customers, setCustomers] = useState(0);
    const [packages, setPackages] = useState(0);
    const [transactions, setTransactions] = useState({
        options: {
            title: {
                text: 'Transactions'
            },
            noData: {
                text: 'No data'
            },
            labels: ['Cancelled', 'Pending', 'Confirmed', 'Completed'],
            colors: ['#d8334a', '#ffd11f', '#f9a72b', '#ffeea3']
        },
        series: []
    })

    React.useEffect(() => {
        fetchTransactions()
        fetchActiveCampaigns()
        fetchActiveActions()
        fetchCustomers()
        fetchPackages()
    }, [])

    const fetchTransactions = async event => {

        const res = await axios.get('/summary/transactions')
        let data = res.data.data

        if(data.cancelled != 0 || data.pending != 0 || data.confirmed != 0 || data.completed)
        setTransactions(prev => ({...prev, 'series' : [data.cancelled, data.pending, data.confirmed, data.completed]}))

    }

    const fetchActiveCampaigns = async event => {

        const res = await axios.get('/summary/active_campaigns')
        let data = res.data.data

        setCampaigns(data.total)

    }

    const fetchActiveActions = async event => {

        const res = await axios.get('/summary/active_actions')
        let data = res.data.data

        setActions(data.total)

    }

    const fetchCustomers = async event => {

        const res = await axios.get('/summary/total_customers')
        let data = res.data.data

        setCustomers(data.total)

    }

    const fetchPackages = async event => {

        const res = await axios.get('/summary/total_packages')
        let data = res.data.data

        setPackages(data.total)

    }

    return (
        <>
            <Row className="dashboard-page">
                <Col md={12} className="mb-3">
                    <Carousel indicators={false}>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={config.url.BASE_URL+"/images/slider-1.png"}
                            alt="First slide"
                            />
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                            className="d-block w-100"
                            src={config.url.BASE_URL+"/images/slider-2.png"}
                            alt="Second slide"
                            />
                        </Carousel.Item>
                    </Carousel>
                </Col>
                <Col className="d-flex mt-n5">
                    <Col md={6} className="mb-3">
                        <Card>
                            <Card.Body>
                                <Card.Text>
                                    <Chart options={transactions.options} series={transactions.series} type="pie"/>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Row>
                            <Col md={6} className="mb-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>
                                            <h6>Active Campaigns</h6>
                                            <h3>{campaigns}</h3>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>
                                            <h6>Active Actions</h6>
                                            <h3>{actions}</h3>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                            {auth.user.type != 3 && <Col md={6} className="mb-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>
                                            <h6>Users</h6>
                                            <h3>{customers}</h3>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>}
                            <Col md={6} className="mb-3">
                                <Card>
                                    <Card.Body>
                                        <Card.Text>
                                            <h6>Packages</h6>
                                            <h3>{packages}</h3>
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                </Col>
            </Row>
        </>
    )

}

export default Dashboard;