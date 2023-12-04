import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import _, { map } from "lodash";
import axios from "axios";
import {AddPackage, DeletePackage, EditPackage, GetPackages} from "../actions/packageAction";
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment-timezone';
import {config} from '../utils/Constants'

const Package = (props) => {
    
    const dispatch = useDispatch();
    const packageList = useSelector(state => state.Package);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [reward, setReward] = useState({});
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)
    const [fields, setFields] = useState([
        {
            'key': 'id',
            'title': 'Name',
            'type': 'hidden',
            'placeholder': 'Package ID',
            'control_id': 'formPackageId',
            'hidden': true
        },
        {
            'key': 'name',
            'title': 'Name',
            'type': 'text',
            'isInvalid': false,
            'placeholder': 'Enter package name',
            'control_id': 'formPackageName',
            'errorMsg': ['The name field is required.'],
            'required': false
        },
        {
            'key': 'description',
            'title': 'Description',
            'type': 'text',
            'isInvalid': false,
            'placeholder': 'Enter package description',
            'control_id': 'formPackageDescription',
            'errorMsg': ['The description field is required.'],
            'required': false
        },
        {
            'key': 'multiplier',
            'title': 'Multiplier',
            'type': 'text',
            'isInvalid': false,
            'placeholder': 'Enter package multiplier',
            'control_id': 'formPackageMultiplier',
            'errorMsg': ['The multiplier field is required.'],
            'required': false
        }
    ])

    const productName = props.match.params.product;

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = (packageData) => {

        setData({})

        setShow(true);

    }
    const handleEditShow = (packageData) => {

        clearFieldErrors()

        packageData.rewards.map((reward, i) => {
            reward['value'] = reward.reward_id
            reward['label'] = reward.reward.name
            return reward
        })

        setData(packageData)

        setShow(true);

    }

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = (url = '/packages') => {

        dispatch(GetPackages(props, url));

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

        setValidated(true)
    }

    const addPackage = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        const tmpFields = clearFieldErrors();

        setSaving(true)

        if(form.checkValidity() !== false) {

            if(data.id) {
                dispatch(EditPackage(props, data))
                .then(() => {
                    setShow(false)
                    setSaving(false)

                    toast.success("Package updated successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }).catch((error) => {
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
                dispatch(AddPackage(props, data))
                .then(() => {
                    setShow(false)
                    setSaving(false)

                    toast.success("Package added successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }).catch((error) => {
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

    let cancelTokenSource;
    const fetchRewards = async (search) => {

        if(typeof cancelTokenSource != typeof undefined) {
            cancelTokenSource.cancel("Operation canceled due to new request.")
        }

        cancelTokenSource = axios.CancelToken.source();

        const res = await axios.get('/rewards', {
            cancelToken: cancelTokenSource.token,
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

    const handleDelete = id => {
    
        dispatch(DeletePackage(props, id))

    }
    const showPagination = () => {
        if(!_.isEmpty(packageList.data.links))
        return packageList.data.links.map((page, i) => {
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

        if(!_.isEmpty(packageList.data.data)) {

            return packageList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name}</td>
                    <td>{el.description}</td>
                    <td>{el.multiplier}</td>
                    <td>{timezoneConvert(el.created_at)}</td>
                    <td>{timezoneConvert(el.updated_at)}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={() => {handleDelete(el.id)}}>Delete</Button>
                            <Button onClick={e => handleEditShow(el)}>Edit</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            })

        }

        if(packageList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(packageList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{packageList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">No data available</td></tr>

    }

    return (
        <>
            <Row>
                <Col md={12}>
                    <Button variant="primary" onClick={handleShow}>
                        Add Packages
                    </Button>
                </Col>
        
                <Modal show={show} onHide={handleClose}>
                    <Form noValidate validated={validated} onSubmit={addPackage}>
                        <Modal.Header closeButton>
                            <Modal.Title>{data.id ? 'Update Package' : 'Add Packages'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {fields.map((field, i) => {
                                return <Form.Group hidden={field.hidden} key={i} as={Row} controlId={field.control_id}>
                                    <Form.Label column sm={3}>{field.title}</Form.Label>
                                    <Col sm={9}>
                                        {field.type === 'number' ?                                        
                                            <Form.Control 
                                                required={field.required}
                                                isInvalid={field.isInvalid}
                                                type={field.type} 
                                                placeholder={field.placeholder}
                                                value={data[field.key]}
                                                min={field.min}
                                                onChange={ (e) => setData(prev => ({...prev, [field.key] : parseFloat(e.target.value)})) }
                                            />
                                        :
                                            <Form.Control 
                                                required={field.required}
                                                isInvalid={field.isInvalid}
                                                type={field.type} 
                                                placeholder={field.placeholder}
                                                value={data[field.key]}
                                                onChange={ (e) => setData(prev => ({...prev, [field.key] : e.target.value})) }
                                            />
                                        }
                                        
                                        {field.isInvalid && <Form.Control.Feedback type="invalid">
                                          {field.errorMsg}
                                        </Form.Control.Feedback>}
                                    </Col>
                                </Form.Group>
                            })}
                            <AsyncSelect key={0} isMulti cacheOptions defaultOptions defaultValue={data.rewards} loadOptions={promiseRewardOptions} onChange={value => setData(prev => ({...prev, 'rewards' : value}))} placeholder="None" />
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
                                <th>Multiplier</th>
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

export default Package;