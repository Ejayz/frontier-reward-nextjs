import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Card, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';

const AdminAction = (props) => {
    
    const dispatch = useDispatch();
    const actionList = useSelector(state => state.Action);
    const [validated, setValidated] = useState(false);
    const [data, setData] = useState({});
    const [saving, setSaving] = useState(false)
    const fields = [
        {
            'key': 'id',
            'title': 'Name',
            'type': 'hidden',
            'placeholder': 'Action ID',
            'control_id': 'formActionId',
            'hidden': true
        },
        {
            'key': 'name',
            'title': 'Name',
            'type': 'text',
            'placeholder': 'Enter action name',
            'control_id': 'formActionName',
            'errorMsg': 'Please provide action name.',
            'required': true
        },
        {
            'key': 'description',
            'title': 'Description',
            'type': 'text',
            'placeholder': 'Enter action description',
            'control_id': 'formActionDescription',
            'errorMsg': 'Please provide action description.',
            'required': true
        }
    ];

    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => {

        setData({})

        setShow(true);

    }
    const handleEditShow = (val) => {

        setData(val)

        setShow(true);

    }

    const fetchData = (url = '/actions') => {

        dispatch(GetData(props, url));

    }

    const handleSubmit = (e) => {

        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;

        setValidated(true);

        if(form.checkValidity() !== false) {
            setSaving(true)

            if(data.id) {
                dispatch(EditData(props, data))
                .then(() => {
                    setSaving(false)
                    setShow(false)

                    toast.success("Action updated successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }).catch((error) => {
                    setSaving(false)
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                })
            } else {
                dispatch(AddData(props, data))
                .then(() => {
                    setSaving(false)
                    setShow(false)

                    toast.success("Action added successfully", {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });
                }).catch((error) => {
                    setSaving(false)
        
                    toast.error(error.response.data.message, {
                        position: toast.POSITION.BOTTOM_RIGHT
                    });

                })
            }

        }

    }

    const handleDelete = id => {
    
        dispatch(DeleteData(props, id))

    }

    const showPagination = () => {
        if(!_.isEmpty(actionList.data.links))
        return actionList.data.links.map((page, i) => {
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

        if(0==0) {

            return actionList.data.data.map((el, key) => {
                return <tr key={key}>
                    <td>{el.name}</td>
                    <td>{el.description}</td>
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

        if(0==0) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(actionList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{actionList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">No data available</td></tr>

    }


    return (
        <>
            <Row>
                <Col md={12}>
                    <Button variant="primary" onClick={handleShow}>
                        Add Action
                    </Button>
                </Col>
        
                <Modal show={show} onHide={handleClose}>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>{data.id ? 'Update Action' : 'Add Action'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {fields.map((field, i) => {
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

const UserAction = (props) => {
    
    const dispatch = useDispatch();
    const actionList = useSelector(state => state.Action);

    const showData = () => {

        if(!_.isEmpty(actionList.data.data)) {

            return actionList.data.data.map((el, key) => {

                return <Col md={4} className="mb-3">
                    <Card key={key}>
                        <Card.Body>
                            <Card.Title>{el.name}</Card.Title>
                            <Card.Text>{el.description}</Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            })

        }

        if(actionList.loading) {

            return <tr><td colSpan="6" className="text-center">Loading...</td></tr>

        }

        if(actionList.errorMsg !== "") {

            return <tr><td colSpan="6" className="text-center">{actionList.errorMsg}</td></tr>

        }

        return <tr><td colSpan="6" className="text-center">No data available</td></tr>

    }

    React.useEffect(() => {

        fetchData()

    }, [])

    const fetchData = (url = '/actions') => {

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

const Init  = (props) => {

    const auth = useSelector(state => state.Auth);

    if(auth.user.type === 1 || auth.user.type === 2) {

        return AdminAction(props)

    } else {

        return UserAction(props)

    }

}

export default AdminAction