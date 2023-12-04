import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Badge, Button, ButtonGroup, Card, Col, Form, Modal, Pagination, Row, Spinner, Table, ToggleButton } from 'react-bootstrap';
import _ from "lodash";
import {AddData, DeleteData, EditData, GetData} from "../actions/rewardAction";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment-timezone';
import {config} from '../utils/Constants'

const AdminReward = (props) => {
    
    const dispatch = useDispatch();
    const dataList = useSelector(state => state.Reward);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [fields, setFields] = useState([
        {
            'key': 'id',
            'title': 'Name',
            'type': 'hidden',
            'placeholder': 'Reward ID',
            'control_id': 'formActionId',
            'hidden': true
        },
        {
            'key': 'type',
            'title': 'Type',
            'type': 'select',
            'placeholder': 'Enter action type',
            'errorMsg': ['Please select type.'],
            'options': [
                {
                    'label': 'Item',
                    'key': 'item'
                }, 
                {
                    'label': 'Discount',
                    'key': 'discount'
                },
                {
                    'label': 'Points',
                    'key': 'points'
                }
            ],
            'control_id': 'formActionType'
        },
        {
            'key': 'value',
            'title': 'Value',
            'type': 'number',
            'min': 0,
            'placeholder': 'Enter reward value',
            'errorMsg': ['Please provide reward value.'],
            'control_id': 'formValue'
        },
        {
            'key': 'cost',
            'title': 'Cost',
            'type': 'number',
            'min': 0,
            'placeholder': 'Enter reward cost',
            'errorMsg': ['Please provide reward cost.'],
            'control_id': 'formCost'
        },
        {
            'key': 'name',
            'title': 'Name',
            'type': 'text',
            'placeholder': 'Enter reward name',
            'errorMsg': ['Please provide reward name.'],
            'control_id': 'formActionName'
        },
        {
            'key': 'description',
            'title': 'Description',
            'type': 'text',
            'placeholder': 'Enter reward description',
            'errorMsg': ['Please provide reward description.'],
            'control_id': 'formActionDescription'
        }
    ])

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => {

        clearFieldErrors()
        setData({
            'type': 'item'
        })
        setShow(true);

    }
    const handleEditShow = (val) => {

        clearFieldErrors()
        setData(val)
        setShow(true);

    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = (url = '/rewards') => {

        dispatch(GetData(props, url));

    }

    const clearFieldErrors = () => {
        let tmpFields = fields;

        setValidated(false)

        tmpFields = tmpFields.map((item, i) => {
            return ({...item, isInvalid: false})
        })

        setFields(tmpFields)

        return tmpFields
    }

    const fieldErrors = (tmpFields, errorData) => {
        for (const key in errorData) {

            if (Object.hasOwnProperty.call(errorData, key)) {

                const fieldError = errorData[key];
                var index = fields.findIndex((item) => item.key === key)

                tmpFields[index]['errorMsg'] = fieldError
                tmpFields[index]['isInvalid'] = true
                
            }
            
        }

        setFields(tmpFields)

        console.log(tmpFields);

        setValidated(true)
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        const tmpFields = clearFieldErrors()

        setSaving(true);

        if(form.checkValidity() !== false) {

            if(data.id) {
                dispatch(EditData(props, data))
                .then(() => {
                    setShow(false)
                    setSaving(false)

                    toast.success("Reward edited successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
                .catch(error => {
                    setSaving(false)

                    if(typeof error.response.data.data != undefined) {
                        var errorData = error.response.data.data

                        fieldErrors(tmpFields, errorData)
                    }
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                })
            }
            else {
                dispatch(AddData(props, data))
                .then(() => {
                    setShow(false)
                    setSaving(false)

                    toast.success("Reward has been added successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                })
                .catch((error) => {
                    setSaving(false)

                    if(typeof error.response.data.data != undefined) {
                        var errorData = error.response.data.data

                        fieldErrors(tmpFields, errorData)
                    }
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                })
            }

        }

    }

    const handleDelete = id => {
    
        // setDeleting(true)

        dispatch(DeleteData(props, id))
        .then(() => {
            setDeleting(false)

            toast.success("Reward has been deleted successfully", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
        })
        .catch((error) => {
            setDeleting(false)

            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });

        })

    }
    const showPagination = () => {
        if(!_.isEmpty(dataList.data.links))
        return dataList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const timezoneConvert = (time) => {
        var userTz = moment.tz.guess(true);
        var time = moment.tz(time, config.url.TIMEZONE);

        return time.tz(userTz).format('YYYY-MM-DD hh:mm:ss A');
    }

    const showData = () => {

        if(!_.isEmpty(dataList.data.data)) {

            return dataList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name}</td>
                    <td>{el.description}</td>
                    <td>{el.type}</td>
                    <td>{parseFloat(el.value)}</td>
                    <td>{parseFloat(el.cost)}</td>
                    <td>{timezoneConvert(el.created_at)}</td>
                    <td>{timezoneConvert(el.updated_at)}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={() => {handleDelete(el.id)}}>{deleting ? 'Deleting...' : 'Delete'}</Button>
                            <Button onClick={e => handleEditShow(el)}>Edit</Button>
                        </ButtonGroup>
                    </td>
                </tr>
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

    return (
        <>
            <Row>
                <Col md={12}>
                    <Button variant="primary" onClick={handleShow}>
                        Add Reward
                    </Button>
                </Col>
        
                <Modal show={show} onHide={handleClose}>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{data.id ? 'Update Reward' : 'Add Reward'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {fields.map((field, i) => {
                                if(field.type === 'text') {
                                    return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                        <Form.Label column sm={3}>{field.title}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control 
                                                required={field.required}
                                                isInvalid={field.isInvalid}
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
                                } else if(field.type === 'number' && field.key != 'cost') {
                                    return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                        <Form.Label column sm={3}>{data.type === 'discount' ? 'Percentage' : (data.type === 'item' ? 'Quantity' : 'Points')}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control 
                                                required={field.required}
                                                isInvalid={field.isInvalid}
                                                type={field.type} 
                                                placeholder={field.placeholder}
                                                value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
                                                min={field.min}
                                                onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                              {field.errorMsg}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                } else if(field.type === 'number' && field.key === 'cost' && (data.type == 'item' || data.type == 'discount')) {
                                    return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                        <Form.Label column sm={3}>{field.title}</Form.Label>
                                        <Col sm={9}>
                                            <Form.Control 
                                                required={field.required}
                                                isInvalid={field.isInvalid}
                                                type={field.type} 
                                                placeholder={field.placeholder}
                                                value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
                                                min={field.min}
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
                                                isInvalid={field.isInvalid}
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
                                }
                            })}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
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
            </Row>

            <Row>
                <Col md={12}>
                    <Table responsive hover size="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Value/Qty.</th>
                                <th>Cost</th>
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
            <ToastContainer />
        </>
    )

}

const UserReward = (props) => {
    
    const dispatch = useDispatch();
    const dataList = useSelector(state => state.Reward);

    const handleRedeem = async (reward_id) => {
        
        try {
        
            const res = await axios.post('redeem', {'reward_id' : reward_id})
    
            var result = res.data.data

            toast.success("Redemption successful", {
                position: toast.POSITION.BOTTOM_RIGHT
            });
            
        } catch (error) {
        
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });

        }
    }

    const showData = () => {

        if(!_.isEmpty(dataList.data.data)) {

            return dataList.data.data.map((el, key) => {

                return <Col md={4} key={key} className="mb-3 reward-content">
                    <Card style={{ height: '100%' }}>
                        <Card.Body>
                            <Card.Title>{el.name}</Card.Title>
                            <Card.Text>{el.description}</Card.Text>
                        </Card.Body>
                        {el.type != 'points' ? <Button variant="dark" onClick={() => handleRedeem(el.id)}>Redeem ({el.cost} PTS)</Button> : ''}
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

    const showPagination = () => {
        if(!_.isEmpty(dataList.data.links))
        return dataList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchData(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const fetchData = (url = '/rewards', params = {}) => {

        dispatch(GetData(params, url));

    }

    const [radioValue, setRadioValue] = useState('all');
    const radios = [
      { name: 'All', value: 'all' },
      { name: 'Eligible', value: 'eligible' }
    ];

    const onFilterChange = (params) => {
        fetchData('/rewards', params)

        setRadioValue(params.show)
    }

    React.useEffect(() => {

        fetchData()

    }, [])

    return (
        <>
            <Row className="pt-3">
                <Col md="12">
                    <Card className="reward-container ml-5 mr-5">
                        <Card.Body className="row">
                            <Col md="12">
                                <ButtonGroup toggle>
                                    {radios.map((radio, idx) => (
                                    <ToggleButton
                                        key={idx}
                                        id={`radio-${idx}`}
                                        type="radio"
                                        variant="outline-warning"
                                        name="radio"
                                        value={radio.value}
                                        checked={radioValue === radio.value}
                                        onChange={(e) => onFilterChange({show: e.currentTarget.value})}
                                    >
                                        {radio.name}
                                    </ToggleButton>
                                    ))}
                                </ButtonGroup>
                            </Col>
                        </Card.Body>
                        <Card.Body className="row">
                            {showData()}
                        </Card.Body>
                        <Card.Body className="row">
                            <Col md={12}>
                                <Pagination size="sm" className="float-right">                    
                                    {showPagination()}
                                </Pagination>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ToastContainer />
        </>
    )

}

export default (props) => {

    const auth = useSelector(state => state.Auth);

    if(auth.user.type === 1 || auth.user.type === 2) {

        return AdminReward(props)

    } else {

        return UserReward(props)

    }
}