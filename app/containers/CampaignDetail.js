import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { Button, ButtonGroup, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import _ from "lodash";
import axios from "axios";

const CampaignDetail = (props) => {
    
    const dispatch = useDispatch();

    const campaignid = props.match.params.campaign;

    const [search, setSearch] = useState("");

    const [campaign, setCampaign] = useState({})

    React.useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async event => {

        const res = await axios.get('/campaigns/' + campaignid)

        console.log(res.data.data);

        setCampaign(res.data.data)

    }

    return (
        <>
            <Row>
                <Col md="12">{campaign.name}</Col>
                <Col md="12">{campaign.description}</Col>
            </Row>
        </>
    )

}

export default CampaignDetail;