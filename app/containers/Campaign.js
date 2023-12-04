import React, {useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Badge, Button, ButtonGroup, Card, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import {AddData, DeleteData, EditData, GetData} from "../actions/campaignAction";
import Moment from 'react-moment';
import AsyncSelect from 'react-select/async';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment-timezone';
import {config} from '../utils/Constants'

const AdminCampaign = (props) => {
    
    const dispatch = useDispatch();    
    const asyncSelReward = useRef(null);
    const asyncSelAction = useRef(null);
    const dataList = useSelector(state => state.Campaign);
    const [campaignList, setCampaignList] = useState({
        loading: false,
        data: [],
        errorMsg: ''
    });
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [reward, setReward] = useState({});
    const [showAddCampaign, setShowAddCampaign] = useState(false);
    const [showAddReward, setShowAddReward] = useState(false);
    const [saving, setSaving] = useState(false)
    const fields = [
        {
            'key': 'id',
            'title': 'ID',
            'type': 'hidden',
            'placeholder': 'Campaign ID',
            'control_id': 'formCampaignId',
            'hidden': true
        },
        {
            'key': 'name',
            'title': 'Name',
            'type': 'text',
            'placeholder': 'Enter campaign name',
            'errorMsg': 'Please provide campaign name.',
            'control_id': 'formCampaignName',
            'required': true
        },
        {
            'key': 'description',
            'title': 'Description',
            'type': 'text',
            'placeholder': 'Enter campaign description',
            'errorMsg': 'Please provide campaign description.',
            'control_id': 'formCampaignDescription',
            'required': true
        },
        {
            'key': 'start_date',
            'title': 'Start Date',
            'type': 'datepicker',
            'placeholder': 'Enter campaign start date',
            'errorMsg': 'Please provide campaign name.',
            'control_id': 'formStartDescription',
            'required': true
        },
        {
            'key': 'end_date',
            'title': 'End Date',
            'type': 'datepicker',
            'placeholder': 'Enter campaign end date',
            'control_id': 'formEndDescription',
            'required': true
        }
    ];
    
    const handleCloseAddCampaign = () => setShowAddCampaign(false);

    const handleShow = () => {

        setData({
            'start_date': new Date(),
            'end_date': new Date()
        })

        setShowAddCampaign(true);

    }

    const handleEditShow = (val) => {

        setData({
            'id': val.id,
            'name': val.name,
            'description': val.description,
            'start_date': new Date(val.start_date),
            'end_date': new Date(val.end_date)
        })

        setShowAddCampaign(true);

    }

    const handleCloseAddReward = () => setShowAddReward(false);

    const handleRewardsShow = async (campaign_id) => {

        setShowAddReward(true);

        setCampaignList({...campaignList, loading: true});
        
        const res = await axios.get('/campaigns/' + campaign_id)
        var data = res.data.data;

        setCampaignList({...campaignList, data: data, loading: false});

    }

    React.useEffect(() => {

        fetchData()

        // fetchActions()

        // fetchRewards()

    }, [])

    const fetchData = (url = '/campaigns') => {

        dispatch(GetData(props, url));

    }

    let cancelActionTokenSource;
    const fetchActions = async (search) => {

        if(typeof cancelActionTokenSource != typeof undefined) {
            cancelActionTokenSource.cancel("Operation canceled due to new request.")
        }

        cancelActionTokenSource = axios.CancelToken.source();

        const res = await axios.get('/actions', {
            cancelToken: cancelActionTokenSource.token,
            params: {
                search: search
            }
        })

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a]
            
            options = [...options, {value: result.id, label: result.name}]
        }

        return options
        
    }

    const promiseActionOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchActions(inputValue));
        }, 1000);
    });

    let cancelRewardTokenSource;
    const fetchRewards = async (search) => {

        if(typeof cancelRewardTokenSource != typeof undefined) {
            cancelRewardTokenSource.cancel("Operation canceled due to new request.")
        }

        cancelRewardTokenSource = axios.CancelToken.source();

        const res = await axios.get('/rewards', {
            cancelToken: cancelRewardTokenSource.token,
            params: {
                search: search
            }
        })

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

    const handleSubmit = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {
            setSaving(true);

            if(data.id) {
                dispatch(EditData(props, data))
                .then(() => {
                    setSaving(false);
                    setShowAddCampaign(false)
                    
                    toast.success("Campaign added successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
                .catch((error) => {
                    setSaving(false);
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                })
            }
            else {
                dispatch(AddData(props, data))
                .then(() => {
                    setSaving(false);
                    setShowAddCampaign(false)
                    
                    toast.success("Campaign added successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
                .catch((error) => {
                    setSaving(false);
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                })
            }

        }

    }

    const addReward = async () => {
        const data = {...reward, campaign_id: campaignList.data.id}

        setSaving(true);
        const res = await axios.post('/campaign_rewards', data)
        const newCampaign = res.data.data;
        const tmp = campaignList
        setSaving(false)

        setReward({});
        asyncSelReward.current.select.select.clearValue();
        asyncSelAction.current.select.select.clearValue();
        
        tmp.data.campaigns.data = [newCampaign, ...tmp.data.campaigns.data];

        setCampaignList({...campaignList, ...tmp});

    }

    const handleDelete = async (id, key) => {

        switch (key) {
            case 'campaign':

                const res = await axios.delete('campaign_rewards/' + id)

                const data = res.data.data;

                var tmp = campaignList.data
                tmp.campaigns.data = tmp.campaigns.data.filter((item) => item.id !== data.id)
                
                setCampaignList({...campaignList, data: tmp});

                break;
        
            default:
    
                dispatch(DeleteData(props, id))

                break;
        }

    }

    const fetchCampaignData = async (url) => {

        const res = await axios.get(url)
        const data = res.data.data

        setCampaignList({...campaignList, data: data});

    }

    const showPagination = (key) => {
        switch (key) {
            case 'campaigns':

                if(!_.isEmpty(campaignList.data.campaigns) && !_.isEmpty(campaignList.data.campaigns.links))
                return campaignList.data.campaigns.links.map((page, i) => {
                    return <Pagination.Item key={i} active={page.active} onClick={() => fetchCampaignData(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                        __html: page.label
                    }}></span></Pagination.Item>
                })
                
                break;
        
            default:

                if(!_.isEmpty(dataList.data.links))
                return dataList.data.links.map((page, i) => {
                    return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                        __html: page.label
                    }}></span></Pagination.Item>
                })

                break;
        }
    }

    const timezoneConvert = (time) => {
        var userTz = moment.tz.guess(true);
        var time = moment.tz(time, config.url.TIMEZONE);

        return time.tz(userTz);
    }

    const showData = () => {

        if(!_.isEmpty(dataList.data.data)) {

            return dataList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name} <Badge variant={(el.is_expired ? "danger": "success")}>{(el.is_expired ? "expired": "active")}</Badge></td>
                    <td>{el.description}</td>
                    <td><Moment format="YYYY/MM/DD">{timezoneConvert(el.start_date)}</Moment></td>
                    <td><Moment format="YYYY/MM/DD">{timezoneConvert(el.end_date)}</Moment></td>
                    <td><Moment format="YYYY/MM/DD hh:mm:ss">{timezoneConvert(el.created_at)}</Moment></td>
                    <td><Moment format="YYYY/MM/DD hh:mm:ss">{timezoneConvert(el.updated_at)}</Moment></td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="success" onClick={() => {handleRewardsShow(el.id)}}>Rewards</Button>
                            <Button variant="danger" onClick={() => {handleDelete(el.id)}}>Delete</Button>
                            <Button onClick={e => handleEditShow(el)}>Edit</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            })

        }

        if(dataList.loading) {

            return <tr><td colSpan="7" className="text-center">Loading...</td></tr>

        }

        if(dataList.errorMsg !== "") {

            return <tr><td colSpan="7" className="text-center">{dataList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="7" className="text-center">No data available</td></tr>

    }

    const showCampaigns = () => {

        if(!_.isEmpty(campaignList.data.campaigns) && !_.isEmpty(campaignList.data.campaigns.data)) {

            return campaignList.data.campaigns.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.reward.name}</td>
                    <td>{el.action.name}</td>
                    <td>{el.quantity}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={() => {handleDelete(el.id, 'campaign')}}>Delete</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            })

        }

        if(campaignList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(campaignList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{dataList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">No data available</td></tr>

    }

    return (
        <>
            <Row>
                <Col md={12}>
                    <Button variant="primary" onClick={handleShow}>
                        Add Campaign
                    </Button>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Table responsive striped bordered hover size="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Start</th>
                                <th>End</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th>Actions</th>
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

            {/* Start Modals */}
        
            <Modal show={showAddCampaign} onHide={handleCloseAddCampaign}>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>{!_.isUndefined(data.id) ? 'Update Campaign' : 'Add Campaign'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {fields.map((field, i) => {
                            if(field.type === 'text') {
                                return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                    <Form.Label column sm={3}>{field.title}</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control 
                                            required={field.required}
                                            type={field.type} 
                                            placeholder={field.placeholder}
                                            value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
                                            onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                          {field.errorMsg}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            } else if(field.type === 'select') {
                                return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                    <Form.Label column sm={3}>{field.title}</Form.Label>
                                    <Col sm={9}>
                                        <Form.Control 
                                            size="sm"
                                            required={field.required}
                                            as={field.type} 
                                            placeholder={field.placeholder}
                                            value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
                                            onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }>

                                            {field.options.map((option, i) => {
                                                return <option key={i} value={option.key}>{option.label}</option>
                                            })}

                                        </Form.Control>
                                        <Form.Control.Feedback type="invalid">
                                            {field.errorMsg}
                                        </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            } else if(field.type === 'datepicker') {
                                return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                <Form.Label column sm={3}>{field.title}</Form.Label>
                                <Col sm={9}>
                                    <DatePicker className="form-control" minDate={new Date()} dateFormat="MM/dd/yyyy" selected={data[field.key]} onChange={date => setData(prev => ({...prev, [field.key] : (date == null ? new Date() : date)}))} required={field.required} />
                                    <Form.Control.Feedback type="invalid">
                                        {field.errorMsg}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            }
                        })}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseAddCampaign}>
                        Close
                        </Button>
                        <Button variant="primary" type="submit">
                            {saving && <Spinner 
                            as="span"
                            animation="border" 
                            size="sm"
                            role="status"
                            aria-hidden="true" />} Save Changes
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        
            <Modal show={showAddReward} onHide={handleCloseAddReward}>
                <Modal.Header closeButton>
                    <Modal.Title>Rewards</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2" controlId="formAction">
                            <Form.Label>Action</Form.Label>
                            <AsyncSelect ref={asyncSelReward} defaultOptions loadOptions={promiseActionOptions} onChange={value => {(value != null) ? setReward(prev => ({...prev, 'action_id' : value.value})) : setReward(prev => ({}))}} />
                            <Form.Text className="text-muted">
                            Choose action first.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formReward">
                            <Form.Label>Reward</Form.Label>
                            <AsyncSelect ref={asyncSelAction} defaultOptions loadOptions={promiseRewardOptions} onChange={value => {(value != null) ? setReward(prev => ({...prev, 'reward_id' : value.value})) : setReward(prev => ({}))} } />
                        </Form.Group>
                        <Form.Group className="mb-2" controlId="formQuantity">
                            <Form.Label>Quantity</Form.Label>
                            <Form.Control type="number" placeholder="Enter qty" onChange={e => setReward(prev => ({...prev, 'quantity' : e.target.value}))} value={!_.isUndefined(reward.quantity) ? reward.quantity : ''} />
                        </Form.Group>
                        <Button onClick={addReward}>
                        {saving && <Spinner 
                            as="span"
                            animation="border" 
                            size="sm"
                            role="status"
                            aria-hidden="true" />} Add
                        </Button>
                    </Form>
                    <Row className="mt-2">     
                        <Col md="12">
                            <Table responsive striped bordered hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Reward</th>
                                        <th>Action</th>
                                        <th>Qty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {showCampaigns()}
                                </tbody>
                            </Table>

                            <Pagination size="sm" className="float-right">                    
                                {showPagination('campaigns')}
                            </Pagination>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

            {/* End Modals */}

            <ToastContainer />
        </>
    )

}

const UserCampaign = (props) => {
    
    const dispatch = useDispatch();
    const dataList = useSelector(state => state.Campaign);

    const showData = () => {

        if(!_.isEmpty(dataList.data.data)) {

            return dataList.data.data.map((el, key) => {

                return <Col md={4}>
                    <Card key={key}>
                        <Card.Body>
                            <Card.Title>{el.name}</Card.Title>
                            <Card.Text>
                                <Row><Col>{el.description}</Col></Row>
                                <Row><Col>Expiration: {el.end_date}</Col></Row>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            })

        }

        if(dataList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(dataList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{dataList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">No data available</td></tr>

    }

    React.useEffect(() => {

        fetchData()

    }, [])

    const fetchData = (url = '/campaigns') => {

        dispatch(GetData(props, url));

    }

    return (
        <>
            <Row className="pt-3">
                {showData()}
            </Row>
        </>
    )

}

export default (props) => {

    const auth = useSelector(state => state.Auth);

    if(auth.user.type === 1 || auth.user.type === 2) {

        return AdminCampaign(props)

    } else {

        return UserCampaign(props)

    }
}