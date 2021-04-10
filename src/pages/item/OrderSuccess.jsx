import React from 'react'
import {Link} from 'react-router-dom'

import { 
    Col,
    Row
} from 'reactstrap'

export default function OrderSuccess({orderId}) {
    return (
        <>
            <Row>
                <Col md={{size: '6', offset: '3'}}>
                    <div className="order-success">
                        <h2>Order Successfully Created</h2>
                        <Link to="/menu">
                            GO TO MENU
                            </Link>
                    </div>
                </Col>
            </Row>
        </>
    )
}
