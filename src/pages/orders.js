import React, { Component, useState, useEffect } from 'react'

import {
    Container,
    Row,
    Col
} from 'reactstrap'


import Database from 'db';

import { Link } from 'react-router-dom';





export default function Orders() {
    
    const [orders, setOrders] = useState([]);
    
    useEffect(async () =>{
        Database.all("SELECT * FROM orders ORDER BY id DESC")
        .then(orders=> {
            console.log(orders);
            setOrders(orders)

        })
        .catch(err=> {
            console.log(err);
        })


    }, [])

    return (
        <Row>
            <Col md={{ size: 10, offset: 1 }}>
                <div className="order-table">
                    <h2 className="title">Orders</h2>
                    <br></br>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <th>Order Id</th>
                                <th>Customer Name</th>
                                <th>Customer Email</th>
                                <th>Product Details</th>
                                <th>Amount</th>
                                {/* <th>Created At</th> */}
                                
                            </thead>
                            <tbody>
                                {orders.map((order, index)=> {
                                    return (
                                        <tr key={index}>
                                            <td>{order.id}</td>
                                            <td>{order.customer_name}</td>
                                            <td>{order.customer_email}</td>
                                            <td>
                                                <Link to={`/order-items/${order.id}`}><button className="btn-sm btn btn-primary">View</button></Link>
                                            </td>
                                            <td>{order.total_amount}</td>
                                        </tr>
                                    )
                                })}
                                
                               
                            </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                </Row>
    )
}


