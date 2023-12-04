import React, {useState} from "react";
import { Badge, Button, ButtonGroup, Card, Col, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';

const Setting = (props) => {
    
    const [user, setUser] = useState({})
    const [validated, setValidated] = useState(false);
    const [errors, setErrors] = useState({})
    const [saving, setSaving] = useState(false)

    React.useEffect(() => {
        fetchProfile(1)
    }, [])

    const fetchProfile = async event => {

        const res = await axios.get('/profile')

        setUser(res.data.data)

        console.log(res.data.data);

    }

    const handleSettingSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await axios.post('/settings', user)
            
            setErrors({});

            toast.success("Settings has been updated successfully.", {
                position: toast.POSITION.BOTTOM_RIGHT
            });

            setSaving(false)
        } catch (error) {
            setErrors(error.response.data.data);
        
            toast.error(error.response.data.message, {
                position: toast.POSITION.BOTTOM_RIGHT
            });

            setSaving(false)
        }
    }

    return (
        <>
        <Card>
            <Form noValidate validated={validated} onSubmit={handleSettingSubmit}>
                <Card.Body>
                    <Card.Title>Personal Information</Card.Title>
                    <Card.Text>
                        <Row><Col>Name</Col></Row>
                        <Row>
                            <Col>
                                <Form.Control 
                                placeholder="First name"
                                value={user.firstname}
                                onChange={ (e) => setUser(prev => ({...prev, firstname : e.target.value})) } />
                            </Col>
                            <Col>
                                <Form.Control placeholder="Middle name"
                                value={user.middlename}
                                onChange={ (e) => setUser(prev => ({...prev, middlename : e.target.value})) } />
                            </Col>
                            <Col>
                                <Form.Control placeholder="Last name"
                                value={user.lastname}
                                onChange={ (e) => setUser(prev => ({...prev, lastname : e.target.value})) } />
                            </Col>
                        </Row>

                        <Form.Group controlId="formGridAddress1">
                            <Form.Label>Phone number</Form.Label>
                            <Form.Control placeholder="1234 Main St"
                            value={user.phone_number}
                            onChange={ (e) => setUser(prev => ({...prev, phone_number : e.target.value})) } />
                        </Form.Group>
                    </Card.Text>
                </Card.Body>
                <Card.Body>
                    <Card.Title>Security</Card.Title>
                    <Card.Text>
                        <Form.Group controlId="formGridEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control placeholder="Email"
                            value={user.email}
                            onChange={ (e) => setUser(prev => ({...prev, email : e.target.value})) } 
                            isInvalid={errors.email} />
                            <Form.Control.Feedback type="invalid">
                                {errors.email}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formGridPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control placeholder="Password"
                            type="password"
                            onChange={ (e) => setUser(prev => ({...prev, password : e.target.value})) } 
                            isInvalid={errors.password}/>
                            <Form.Control.Feedback type="invalid">
                                {errors.password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formGridNewPassword">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control placeholder="New Password"
                            type="password"
                            onChange={ (e) => setUser(prev => ({...prev, new_password : e.target.value})) }
                            isInvalid={errors.new_password} />
                            <Form.Control.Feedback type="invalid">
                                {errors.new_password}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formGridConfirmPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control placeholder="Confirm Password"
                            type="password"
                            onChange={ (e) => setUser(prev => ({...prev, new_password_confirmation : e.target.value})) } />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {saving && <Spinner 
                            as="span"
                            animation="border" 
                            size="sm"
                            role="status"
                            aria-hidden="true" />} Update
                        </Button>
                    </Card.Text>
                </Card.Body>
            </Form>
        </Card>
        <ToastContainer />
        </>
    )

}

export default Setting;