import React, {useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Accordion, Badge, Button, ButtonGroup, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import {AddData, DeleteData, EditData, GetData} from "../actions/transactionAction";
import AsyncSelect from 'react-select/async';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";

const AdminTransaction = (props) => {
    
    const dispatch = useDispatch();
    const transactionList = useSelector(state => state.Transaction);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [reward, setReward] = useState({});
    const [filters, setFilters] = useState({
        type: 'all'
    });
    const fields = [];

    const [show, setShow] = useState(false);
    const [dialogShow, setDialogShow] = useState(false);
    const [statusUpdateData, setStatusUpdateData] = useState({});
  
    const handleDialogClose = () => {
        setDialogShow(false);
        setStatusUpdateData({});
    }
    
    const handleDialogConfirm = async () => {
        await axios.put('transactions/' + statusUpdateData.id, statusUpdateData)
        .then((res) => {
    
            dispatch({
                type: "UPDATE_SUCCESS",
                payload: res.data.data
            })

            handleDialogClose()
        })
        .catch((error) => {
            if(error.response) {
                dispatch({
                    type: "FAIL",
                    payload: error.response.data.message
                })
            }
        })
    }
    const handleClose = () => setShow(false);
    const handleShow = (packageData) => {

        setData({})

        setShow(true);

    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = (url = '/transactions', params = filters) => {

        dispatch(GetData(props, url, params));

    }

    const addPackage = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {

            if(data.id) dispatch(EditData(props, data))
            else dispatch(AddData(props, data))

        }

    }

    const fetchRewards = async () => {

        const res = await axios.get('/rewards')

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a]
            
            options = [...options, {value: result.id, label: result.name}]
        }
        
        return options
    }

    const promiseRewardOptions = inputValue => new Promise(resolve => {

        setTimeout(() => {
            resolve(fetchRewards(inputValue));
        }, 1000);

    });

    const showPagination = () => {
        if(!_.isEmpty(transactionList.data.links))
        return transactionList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url, {})} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const handleTransactionStatusChange = (id, status) => {
        setDialogShow(true);
        setStatusUpdateData({
            'id' : id,
            'status' : status
        })
    }

    const showData = () => {

        if(!_.isEmpty(transactionList.data.data)) {

            return transactionList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.transaction_id}</td>
                    <td>{el.type}</td>
                    <td>{el.reference_no}</td>
                    <td>{el.balance}</td>
                    <td>{el.cost}</td>
                    <td>{el.customer.name}</td>
                    <td>{el.salesperson ? el.salesperson.name : ''}</td>
                    <td>{el.created_at}</td>
                    <td>{el.updated_at}</td>
                    <td>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Row>
                                <Form.Control as="select" size="sm" custom value={el.status} onChange={(e) => handleTransactionStatusChange(el.id, e.target.value, el.status)}>
                                    <option value="pending">Pending</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="completed">Completed</option>
                                </Form.Control>
                            </Form.Row>
                        </Form.Group>
                    </td>
                </tr>
            })

        }

        if(transactionList.loading) {

            return <tr><td colSpan="10" className="text-center">Loading...</td></tr>

        }

        if(transactionList.errorMsg !== "") {

            return <tr><td colSpan="10" className="text-center">{transactionList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="10" className="text-center">No data available</td></tr>

    }

    const handleTypeChange = (val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, type : val};
        setFilters(tmpFilter)

        fetchData('/transactions', tmpFilter)
    }

    const handleFilterInputChange = (key, val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, [key] : val};
        setFilters(tmpFilter)

        fetchData('/transactions', tmpFilter)
    }

    const handleDateRangeChange = (start, end, label) => {
        let tmpFilter = filters

        start = start.format('YYYY-MM-DD');
        end = end.format('YYYY-MM-DD');
        tmpFilter = {...tmpFilter, 'start_date' : start, 'end_date' : end};
        setFilters(tmpFilter)

        fetchData('/transactions', tmpFilter)
    }

    return (
        <>
            <Row>
                <Col md={12}>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>Type</Form.Label>
                            <Col lg={3}>
                                <Form.Control as="select" size="sm" custom defaultValue={!_.isEmpty(filters) && !_.isEmpty(filters.type) ? filters.type : 'all'} onChange={(e) => handleTypeChange(e.target.value)}>
                                <option value="all">All</option>
                                <option value="rewards">Rewards</option>
                                <option value="redeems">Redeems</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Transaction ID
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g. abcd1234" onChange={(e) => handleFilterInputChange('transaction_id', e.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Reference No.
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g. abcd1234" onChange={(e) => handleFilterInputChange('reference_no', e.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Customer
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g. John Doe" onChange={(e) => handleFilterInputChange('customer', e.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Salesperson
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g. Jane Doe" onChange={(e) => handleFilterInputChange('salesperson', e.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Date
                            </Form.Label>
                            <Col lg={3}>
                                <DateRangePicker
                                initialSettings={{ startDate: moment(), endDate: moment() }}
                                onCallback={handleDateRangeChange}
                                >
                                <input type="text" className="form-control" />
                                </DateRangePicker>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Modal show={dialogShow} onHide={handleDialogClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>You want to mark this as <b>{!_.isEmpty(statusUpdateData) ? statusUpdateData.status : '' }</b>?</p>
                        {!_.isEmpty(statusUpdateData) && statusUpdateData.status == 'confirmed' ? <Form.Group controlId="formBasicEmail">
                            <Form.Label>Reference No.</Form.Label>
                            <Form.Control type="text" placeholder="Enter reference no." onChange={ (e) => setStatusUpdateData(prev => ({...prev, 'reference_no' : e.target.value})) } />
                        </Form.Group> : '' }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDialogClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) => handleDialogConfirm()}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Col md={12}>
                    <Table responsive hover size="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Transaction ID</th>
                                <th>Type</th>
                                <th>Reference No.</th>
                                <th>Running Balance</th>
                                <th>Total</th>
                                <th>Customer</th>
                                <th>Salesperson</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th style={{width: "10%"}}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {showData()}
                        </tbody>
                    </Table>

                    <Pagination size="sm" className="float-right">                    
                        {showPagination()}
                    </Pagination>
                </Col>
            </Row>
        </>
    )

}

const CustomerTransaction = (props) => {
    const dispatch = useDispatch();
    const transactionList = useSelector(state => state.Transaction);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [reward, setReward] = useState({});
    const [filters, setFilters] = useState({
        type: 'all'
    });
    const [dialogShow, setDialogShow] = useState(false);
    const [statusUpdateData, setStatusUpdateData] = useState({});
  
    const handleDialogClose = () => {
        setDialogShow(false);
        setStatusUpdateData({});
    }
    
    const handleDialogConfirm = async () => {
        await axios.put('transactions/' + statusUpdateData.id, statusUpdateData)
        .then((res) => {
    
            dispatch({
                type: "UPDATE_SUCCESS",
                payload: res.data.data
            })

            handleDialogClose()
        })
        .catch((error) => {
            if(error.response) {
                dispatch({
                    type: "FAIL",
                    payload: error.response.data.message
                })
            }
        })
    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = (url = '/transactions', params = filters) => {

        dispatch(GetData(props, url, params));

    }

    const showPagination = () => {
        if(!_.isEmpty(transactionList.data.links))
        return transactionList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url, {})} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const showData = () => {

        if(!_.isEmpty(transactionList.data.data)) {

            return transactionList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.transaction_id}</td>
                    <td>{el.type}</td>
                    <td>{el.reference_no}</td>
                    <td>{el.balance}</td>
                    <td>{el.cost}</td>
                    <td>{el.customer.name}</td>
                    <td>{el.salesperson ? el.salesperson.name : ''}</td>
                    <td>{el.created_at}</td>
                    <td>{el.updated_at}</td>
                    <td><Badge variant="info">{el.status}</Badge></td>
                </tr>
            })

        }

        if(transactionList.loading) {

            return <tr><td colSpan="10" className="text-center">Loading...</td></tr>

        }

        if(transactionList.errorMsg !== "") {

            return <tr><td colSpan="10" className="text-center">{transactionList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="10" className="text-center">No data available</td></tr>

    }

    const handleTypeChange = (val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, type : val};
        setFilters(tmpFilter)

        fetchData('/transactions', tmpFilter)
    }

    const handleFilterInputChange = (key, val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, [key] : val};
        setFilters(tmpFilter)

        fetchData('/transactions', tmpFilter)
    }

    const handleDateRangeChange = (start, end, label) => {
        let tmpFilter = filters

        start = start.format('YYYY-MM-DD');
        end = end.format('YYYY-MM-DD');
        tmpFilter = {...tmpFilter, 'start_date' : start, 'end_date' : end};
        setFilters(tmpFilter)

        fetchData('/transactions', tmpFilter)
    }

    return (
        <>
            <Row>
                <Col md={12}>
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>Type</Form.Label>
                            <Col lg={3}>
                                <Form.Control as="select" size="sm" custom defaultValue={!_.isEmpty(filters) && !_.isEmpty(filters.type) ? filters.type : 'all'} onChange={(e) => handleTypeChange(e.target.value)}>
                                <option value="all">All</option>
                                <option value="rewards">Rewards</option>
                                <option value="redeems">Redeems</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Transaction ID
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g. abcd1234" onChange={(e) => handleFilterInputChange('transaction_id', e.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Reference No.
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g. abcd1234" onChange={(e) => handleFilterInputChange('reference_no', e.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Salesperson
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g. Jane Doe" onChange={(e) => handleFilterInputChange('salesperson', e.target.value)} />
                            </Col>
                        </Form.Row>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Date
                            </Form.Label>
                            <Col lg={3}>
                                <DateRangePicker
                                initialSettings={{ startDate: moment(), endDate: moment() }}
                                onCallback={handleDateRangeChange}
                                >
                                <input type="text" className="form-control" />
                                </DateRangePicker>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Modal show={dialogShow} onHide={handleDialogClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Are you sure?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>You want to mark this as <b>{!_.isEmpty(statusUpdateData) ? statusUpdateData.status : '' }</b>?</p>
                        {!_.isEmpty(statusUpdateData) && statusUpdateData.status == 'confirmed' ? <Form.Group controlId="formBasicEmail">
                            <Form.Label>Reference No.</Form.Label>
                            <Form.Control type="text" placeholder="Enter reference no." onChange={ (e) => setStatusUpdateData(prev => ({...prev, 'reference_no' : e.target.value})) } />
                        </Form.Group> : '' }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleDialogClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={(e) => handleDialogConfirm()}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Table responsive striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Type</th>
                            <th>Reference No.</th>
                            <th>Running Balance</th>
                            <th>Total</th>
                            <th>Customer</th>
                            <th>Salesperson</th>
                            <th>Created</th>
                            <th>Updated</th>
                            <th style={{width: "10%"}}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showData()}
                    </tbody>
                </Table>

                <Pagination size="sm" className="float-right">                    
                    {showPagination()}
                </Pagination>
            </Row>
        </>
    )

}

export default (props) => {

    const auth = useSelector(state => state.Auth);

    if(auth.user.type === 1 || auth.user.type === 2) {

        return AdminTransaction(props)

    } else {

        return CustomerTransaction(props)

    }
}