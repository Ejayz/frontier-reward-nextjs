import React, { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, CloseButton, Col, Form, Row, Modal, Pagination, Spinner, Table } from 'react-bootstrap';
import _, { isUndefined } from "lodash";
import axios from "axios";
import AsyncSelect from 'react-select/async';
import { Register, GetData, EditData, DeleteData } from "../actions/userAction";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment-timezone';
import {config} from '../utils/Constants'

const User = (props) => {

    const dispatch = useDispatch();
    const userList = useSelector(state => state.User);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [filters, setFilters] = useState({});
    const [show, setShow] = useState(false);  
    const dmsAxios = axios.create({
        baseURL: 'https://stage.apigw.cdkapps.eu',
        headers: {"Access-Control-Allow-Origin": "http://localhost:3000"}
    });
    const [saving, setSaving] = useState(false)
    const adminFields = [
        {
            'key': 'user_type_id',
            'title': 'Type',
            'type': 'select',
            'placeholder': 'Enter action type',
            'options': [
                {
                    'label': 'Customer',
                    'key': '3'
                }, 
                {
                    'label': 'Admin',
                    'key': '2'
                }
            ],
            'default': 2,
            'control_id': 'formActionType',
            'errorMsg': 'Please select type.',
            'required': false
        },
        {
            'key': 'firstname',
            'title': 'First name',
            'type': 'text',
            'placeholder': 'Enter first name',
            'control_id': 'formFirstName',
            'errorMsg': 'Please provide first name.',
            'required': false
        },
        {
            'key': 'middlename',
            'title': 'Middle name',
            'type': 'text',
            'placeholder': 'Enter middle name',
            'control_id': 'formMiddleName'
        },
        {
            'key': 'lastname',
            'title': 'Last name',
            'type': 'text',
            'placeholder': 'Enter last name',
            'control_id': 'formLastName',
            'errorMsg': 'Please provide last name.',
            'required': false
        },
        {
            'key': 'email',
            'title': 'Email',
            'type': 'email',
            'placeholder': 'Enter email',
            'control_id': 'formEmail',
            'errorMsg': 'Please provide email address.',
            'required': false
        },
        {
            'key': 'phone_number',
            'title': 'Phone number',
            'type': 'text',
            'placeholder': 'Enter phone number',
            'control_id': 'formPhone',
            'errorMsg': 'Please provide phone number.',
            'required': false
        }
    ];
    const customerFields = [
        {
            'key': 'user_type_id',
            'title': 'Type',
            'type': 'select',
            'placeholder': 'Enter action type',
            'options': [
                {
                    'label': 'Customer',
                    'key': '3'
                }, 
                {
                    'label': 'Admin',
                    'key': '2'
                }
            ],
            'default': 2,
            'control_id': 'formActionType',
            'errorMsg': ['Please select type.'],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'customer_id',
            'title': 'Customer ID',
            'type': 'text',
            'placeholder': 'Enter customer ID',
            'control_id': 'formCustomerId',
            'errorMsg': ['Please provide customer ID.'],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'firstname',
            'title': 'First name',
            'type': 'text',
            'placeholder': 'Enter first name',
            'control_id': 'formFirstName',
            'errorMsg': ['Please provide first name.'],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'middlename',
            'title': 'Middle name',
            'type': 'text',
            'placeholder': 'Enter middle name',
            'control_id': 'formMiddleName'
        },
        {
            'key': 'lastname',
            'title': 'Last name',
            'type': 'text',
            'placeholder': 'Enter last name',
            'control_id': 'formLastName',
            'errorMsg': ['Please provide last name.'],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'email',
            'title': 'Email',
            'type': 'email',
            'placeholder': 'Enter email',
            'control_id': 'formEmail',
            'errorMsg': ['Please provide email address.'],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'phone_number',
            'title': 'Phone number',
            'type': 'text',
            'placeholder': 'Enter phone number',
            'control_id': 'formPhone',
            'errorMsg': ['Please provide phone number.'],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'points',
            'title': 'Points',
            'type': 'number',
            'placeholder': 'Enter points',
            'control_id': 'formPoints',
            'errorMsg': [],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'package_id',
            'title': 'Package',
            'type': 'asyncselect',
            'placeholder': 'Enter name',
            'control_id': 'formName',
            'errorMsg': ['Please add package.'],
            'required': false,
            'isInvalid': false
        },
        {
            'key': 'vehicles',
            'fields': [
                [
                    {
                        'key': 'vehicle_id',
                        'title': 'ID',
                        'type': 'text',
                        'placeholder': 'Enter vehicle ID',
                        'control_id': 'formVehicleID'
                    },
                    {
                        'key': 'year',
                        'title': 'Year',
                        'type': 'text',
                        'placeholder': 'Enter vehicle year',
                        'control_id': 'formVehicleYear'
                    },
                    {
                        'key': 'make',
                        'title': 'Make',
                        'type': 'text',
                        'placeholder': 'Enter vehicle make',
                        'control_id': 'formVehicleMake'
                    },
                    {
                        'key': 'model',
                        'title': 'Model',
                        'type': 'text',
                        'placeholder': 'Enter vehicle model',
                        'control_id': 'formVehicleModel'
                    },
                    {
                        'key': 'trim',
                        'title': 'Trim',
                        'type': 'text',
                        'placeholder': 'Enter vehicle trim',
                        'control_id': 'formVehicleTrim'
                    },
                    {
                        'key': 'color',
                        'title': 'Color',
                        'type': 'text',
                        'placeholder': 'Enter vehicle color',
                        'control_id': 'formVehicleColor'
                    },
                    {
                        'key': 'vin_no',
                        'title': 'Vin No.',
                        'type': 'text',
                        'placeholder': 'Enter vehicle number',
                        'control_id': 'formVehicleVinNo'
                    }
                ]
            ]
        }
    ];
    const [fields, setFields] = useState(customerFields);
    const vehicleFields = [
        {
            'key': 'vehicle_id',
            'title': 'ID',
            'type': 'text',
            'placeholder': 'Enter vehicle ID',
            'control_id': 'formVehicleID'
        },
        {
            'key': 'year',
            'title': 'Year',
            'type': 'text',
            'placeholder': 'Enter vehicle year',
            'control_id': 'formVehicleYear'
        },
        {
            'key': 'make',
            'title': 'Make',
            'type': 'text',
            'placeholder': 'Enter vehicle make',
            'control_id': 'formVehicleMake'
        },
        {
            'key': 'model',
            'title': 'Model',
            'type': 'text',
            'placeholder': 'Enter vehicle model',
            'control_id': 'formVehicleModel'
        },
        {
            'key': 'trim',
            'title': 'Trim',
            'type': 'text',
            'placeholder': 'Enter vehicle trim',
            'control_id': 'formVehicleTrim'
        },
        {
            'key': 'color',
            'title': 'Color',
            'type': 'text',
            'placeholder': 'Enter vehicle color',
            'control_id': 'formVehicleColor'
        },
        {
            'key': 'vin_no',
            'title': 'Vin No.',
            'type': 'text',
            'placeholder': 'Enter vehicle number',
            'control_id': 'formVehicleVinNo'
        }
    ]

    const handleClose = () => setShow(false);
    const handleShow = () => {

        setData({
            user_type_id: 3,
            vehicles: [{}]
        })

        setValidated(false)

        setFields(customerFields)

        setShow(true);

    }

    const clearFieldErrors = () => {
        let tmpFields = fields;

        setValidated(false)

        tmpFields = tmpFields.map((item, i) => {
            return ({...item, isInvalid: false})
        })

        const index = tmpFields.findIndex((item) => item.key === 'vehicles');

        if(!isUndefined(tmpFields[index])) {
            tmpFields[index].fields = tmpFields[index].fields.map((vehicle, i) => {
                return vehicle.map((item, i) => {
                    return ({...item, isInvalid: false})
                })
            })

        }

        setFields(tmpFields)

        return tmpFields
    }

    const fieldErrors = (tmpFields, errorData) => {
        for (let key in errorData) {

            if (Object.hasOwnProperty.call(errorData, key)) {

                const fieldError = errorData[key];

                const split = key.split('.');
                if(split[0] === 'vehicles') {
                    if(split.length === 3) {
                        key = split[0];
                        var index = fields.findIndex((item) => item.key === key)
                        var fieldIndex = tmpFields[index]['fields'][split[1]].findIndex((item) => item.key === split[2])
        
                        tmpFields[index]['fields'][split[1]][fieldIndex]['errorMsg'] = fieldError
                        tmpFields[index]['fields'][split[1]][fieldIndex]['isInvalid'] = true
                    } else {
                        key = split[0];
                        var index = fields.findIndex((item) => item.key === key)
        
                        tmpFields[index]['errorMsg'] = fieldError
                        tmpFields[index]['isInvalid'] = true
                    }
                } else {
                    key = (key === 'package_id.value') ? 'package_id' : key;
                    var index = fields.findIndex((item) => item.key === key)
    
                    tmpFields[index]['errorMsg'] = fieldError
                    tmpFields[index]['isInvalid'] = true
                }
                
            }
            
        }

        setFields(tmpFields)

        setValidated(true)
    }

    const addUser = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        const tmpFields = clearFieldErrors();

        setSaving(true);

        if(form.checkValidity() !== false) {
    
            if(data.id) {
                dispatch(EditData(props, data))
                .then(() => {
                    setShow(false)
                    setSaving(false)

                    toast.success("User has been updated successfully", {
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
            } else {
                dispatch(Register(props, data))
                .then(() => {
                    setShow(false);
                    setSaving(false)

                    toast.success("User has been added successfully", {
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

    const fetchUsers = (url = '/users', $params = {}) => {

        dispatch(GetData(props, url, $params));

    }

    const showPagination = () => {
        if(!_.isEmpty(userList.data.links))
        return userList.data.links.map((page, i) => {
            return <Pagination.Item key={i} active={page.active} onClick={() => fetchUsers(page.url)} disabled={!page.url}><span dangerouslySetInnerHTML={{
                __html: page.label
            }}></span></Pagination.Item>
        })
    }

    const timezoneConvert = (time) => {
        var userTz = moment.tz.guess(true);
        var time = moment.tz(time, config.url.TIMEZONE);

        return time.tz(userTz);
    }

    const showData = () => {

        if(!_.isEmpty(userList.data.data)) {

            return userList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td><Link to={'user/' + el.id}>{el.info ? el.info.customer_id : '-'}</Link></td>
                    <td><Link to={'user/' + el.id}>{el.name}</Link></td>
                    <td>{el.type_name}</td>
                    <td>{el.email}</td>
                    <td>{el.phone_number}</td>
                    <td>{el.info && el.info.package ? el.info.package.name : 'None'}</td>
                    <td>{timezoneConvert(el.created_at).format('YYYY-MM-DD hh:mm:ss A')}</td>
                    <td>{timezoneConvert(el.updated_at).format('YYYY-MM-DD hh:mm:ss A')}</td>
                    <td>
                        <ButtonGroup size="sm">
                            <Button variant="danger" onClick={() => {handleDelete(el.id)}}>Delete</Button>
                            <Button onClick={e => handleEditShow(el)}>Edit</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            })

        }

        if(userList.loading) {

            return <tr><td colSpan="9" className="text-center">Loading...</td></tr>

        }

        if(userList.errorMsg !== "") {

            return <tr><td colSpan="9" className="text-center">{userList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="9" className="text-center">No data available</td></tr>

    }

    const handleEditShow = (val) => {
        let dataVal = {...val};
        const key = 'vehicles';
        let vFields = [...customerFields];
        const index = vFields.findIndex((item) => item.key === key);

        dataVal.customer_id = dataVal.info ? dataVal.info.customer_id : ''
        dataVal.package_id = dataVal.info ? {'value' : dataVal.info.package.id, 'label' : dataVal.info.package.name} : ''
        dataVal.vehicles = dataVal.vehicles.map((item, i) => {
            if(i > 0) {vFields[index]['fields'] = [...vFields[index]['fields'], vehicleFields]}

            return ({...item.vehicle_info, id: item.id})
        });

        setFields(vFields);

        setData(dataVal)

        setShow(true);
    }

    const handleDelete = id => {
    
        dispatch(DeleteData(props, id))

    }

    const fetchPackages = async (search) => {

        const res = await axios.get('/packages?search=' + search)

        var results = res.data.data

        var options = [];

        for (let a = 0; a < results.data.length; a++) {
            const result = results.data[a]
            
            options = [...options, {value: result.id, label: result.name}]
        }

        return options
        
    }

    const promisePackagesOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(fetchPackages(inputValue));
        }, 1000);
    });

    const searchCustomer = async (email) => {

        const res = await dmsAxios.get('/sample/sample/v3/customers?email='+email+'&page=1&pageSize=50')

        console.log(res);
    }

    const promiseCustomersOptions = inputValue => new Promise(resolve => {
        setTimeout(() => {
            resolve(searchCustomer(inputValue));
        }, 1000);
    });

    const userForm = () => {
        let form = fields

        return form.map((field, i) => {
            if(field.key == 'vehicles') {
                return vehicleForm(field.fields, field.key)
            } else if(field.type === 'text' || field.type === 'email' || field.type === 'number') {
                return <Form.Group as={Row} key={i} controlId={field.control_id}>
                    <Form.Label column sm={3}>{field.title}</Form.Label>
                    <Col sm={9}>
                        <Form.Control
                            size="sm"
                            required={field.required}
                            isInvalid={field.isInvalid}
                            type={field.type} 
                            placeholder={field.placeholder}
                            value={!_.isUndefined(data[field.key]) ? data[field.key] : ''}
                            defaultValue={data[field.key]}
                            onChange={ e => setData(prev => ({...prev, [field.key] : e.target.value})) }
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
                            onChange={ (e) => {
                                setValidated(false)

                                if(field.key == 'user_type_id') {
                                    if(e.target.value == 2) {
                                        setFields(adminFields)
                                    } else {
                                        setFields(customerFields)
                                    }
                                }

                                setData(prev => ({...prev, [field.key] : e.target.value}))
                            }}>

                            {field.options.map((option, i) => {
                                return <option key={i} value={option.key}>{option.label}</option>
                            })}

                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {field.errorMsg}
                        </Form.Control.Feedback>
                    </Col>
                </Form.Group>
            } else if(field.type === 'asyncselect') {
                if(field.key == 'package_id') {
                    return <Form.Group key={i} as={Row}>
                        <Form.Label column sm={3}>{field.title}</Form.Label>
                        <Col sm={9}>
                            <AsyncSelect size="sm" className={field.isInvalid ? 'is-invalid' : ''} styles={{
                                control: (provided, state) => ({
                                    ...provided,
                                    borderColor: field.isInvalid ? (state.isSelected ? 'red' : 'red') : '#ced4da'
                                }),
                            }} defaultOptions defaultValue={!_.isUndefined(data[field.key]) ? data[field.key] : ''} loadOptions={promisePackagesOptions} onChange={value => setData(prev => ({...prev, [field.key] : value}))} />
                            
                            {field.isInvalid && <Form.Control.Feedback type="invalid">
                                {field.errorMsg}
                            </Form.Control.Feedback>}
                        </Col>
                    </Form.Group>
                }
            }
        })
    }

    const vehicleForm = (vFields, vKey) => {
        return vFields.map((fields, i) => {
            const vIndex = i;
            return (
                <>
                    <p>Vehicle #{vIndex + 1} {vIndex !== 0 && <CloseButton onClick={() => removeVehicle(vIndex)} />}</p>
                    <hr/>
                    {
                        fields.map((field, i) => {
                            return <Form.Group as={Row} key={i} controlId={field.control_id}>
                                <Form.Label column sm={3}>{field.title}</Form.Label>
                                <Col sm={9}>
                                    <Form.Control 
                                        size="sm"
                                        required={field.required}
                                        isInvalid={field.isInvalid}
                                        type={field.type} 
                                        placeholder={field.placeholder}
                                        value={!_.isUndefined(data[vKey]) && !_.isUndefined(data[vKey][vIndex]) && !_.isUndefined(data[vKey][vIndex][field.key]) ? data[vKey][vIndex][field.key] : ''}
                                        defaultValue={!_.isUndefined(data[vKey]) && !_.isUndefined(data[vKey][vIndex]) && !_.isUndefined(data[vKey][vIndex][field.key]) ? data[vKey][vIndex][field.key] : ''}
                                        onChange={ e => {
                                            let finalData = data[vKey];
                                            let tmpData = finalData[vIndex];
                                            tmpData = {...tmpData, [field.key]: e.target.value};
                                            finalData[vIndex] = tmpData;
                                            
                                            setData(prev => ({...prev, [vKey] : finalData}))
                                        } }
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {field.errorMsg}
                                    </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                        })
                    }
                </>
            )
        })
    }

    const addVehicle = () => {
        const key = 'vehicles';
        let vFields = [...fields];
        const index = vFields.findIndex((item) => item.key === key);
        vFields[index]['fields'] = [...vFields[index]['fields'], vehicleFields]
        setFields(vFields);

        let vData = {...data}
        vData['vehicles'] = [...vData['vehicles'], {}]
        setData(vData)
    }

    const removeVehicle = (i) => {
        const key = 'vehicles';
        let vFields = [...fields];
        const index = vFields.findIndex((item) => item.key === key);
        let vFieldsTmp = vFields[index].fields;
        let newVFields = vFieldsTmp.filter((item, index) => index != i);
        vFields[index]['fields'] = newVFields
        setFields(vFields);

        let vData = {...data};
        vData['vehicles'] = vData['vehicles'].filter((item, index) => index != i);
        setData(vData);
    }

    const handleTypeChange = (val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, type : val};
        setFilters(tmpFilter)

        fetchUsers('/users', tmpFilter)
    }

    const handleFilterInputChange = (key, val) => {
        let tmpFilter = filters

        tmpFilter = {...tmpFilter, [key] : val};
        setFilters(tmpFilter)

        fetchUsers('/users', tmpFilter)
    }

    React.useEffect(() => {

        fetchUsers()

        // fetchRewards()

    }, [])

    return (
        <>
            <Row>
                <Col md={12}>
                    <Button variant="primary" onClick={handleShow}>
                        Add User
                    </Button>
                </Col>
        
                <Modal show={show} onHide={handleClose} backdrop="static">
                    <Form noValidate validated={validated} onSubmit={addUser}>
                        <Modal.Header closeButton>
                            <Modal.Title>{!_.isUndefined(data.id) ? 'Edit User' : 'Add User'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>                            
                            {userForm()}
                            {data.user_type_id == 3 && <Button variant="primary" onClick={(e) => {addVehicle()}}>Add Vehicle</Button>}
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
                    <Form.Group controlId="exampleForm.SelectCustom">
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>Type</Form.Label>
                            <Col lg={3}>
                                <Form.Control as="select" size="sm" custom defaultValue={!_.isEmpty(filters) && !_.isEmpty(filters.type) ? filters.type : 'all'} onChange={(e) => handleTypeChange(e.target.value)}>
                                <option value="all">All</option>
                                <option value="3">Customers</option>
                                <option value="2">Admins</option>
                                <option value="1">Super Admins</option>
                                </Form.Control>
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Customer ID
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g ABC123" onChange={(e) => handleFilterInputChange('customer_id', e.target.value)} />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Name
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g John Doe" onChange={(e) => handleFilterInputChange('search', e.target.value)} />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                    <Form.Group>
                        <Form.Row>
                            <Form.Label column="sm" lg={1}>
                            Email
                            </Form.Label>
                            <Col lg={3}>
                            <Form.Control size="sm" type="text" placeholder="e.g example@example.com" onChange={(e) => handleFilterInputChange('email', e.target.value)} />
                            </Col>
                        </Form.Row>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={12}>
                    <Table responsive hover size="sm">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Package</th>
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

export default User;