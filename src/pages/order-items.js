import React, { Component, useState, useEffect } from 'react'

import {
    Container,
    Row,
    Col
} from 'reactstrap'


import Database from 'db';

import { Link, useParams } from 'react-router-dom';





export default function OrdersItems() {
    
    const [orderItems, setOrderItems] = useState([]);

    const params = useParams();

    
    
    useEffect(async () =>{

        console.log(params); 

        const orderId = params.orderId;

        
        const orderItems = await Database.all(`SELECT order_items.id, items.name, order_items.quantity FROM order_items INNER JOIN items ON order_items.item_id = items.id WHERE order_items.order_id = '${orderId}'`)
       
        setOrderItems(orderItems);

    }, [])

    return (
        <Row>
            <Col md={{ size: 10, offset: 1 }}>
                <div className="order-table">
                    <h2>Order Items</h2>
                    <br></br>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <th>Sno.</th>
                                <th>Product Name</th>
                                <th>Quantity</th>                                
                            </thead>
                            <tbody>
                                {orderItems.map((orderItem, index)=> {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{orderItem.name}</td>
                                            <td>{orderItem.quantity}</td>
                                           
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


