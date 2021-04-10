import React, { Component, useState, useEffect } from 'react'

import {
    Row,
    Col
} from 'reactstrap'

import Database from 'db'

export default function Show() {

    const [items, setItems] = useState([])
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() =>{
        Database.all("SELECT * FROM items")
        .then(response => {
            setItems(response)
       
        })
        .catch(err => {
            console.log(err);
        })
    }, [])


    return (
        <>
            <Row>
                <Col md={{ size: 10, offset: 2 }} sm={{ size: 10, offset: 2 }}>
                    <div className="item-table">
                        <h2 className="title">Products</h2>
                        <br></br>
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <th>Barcode</th>
                                    <th>Product Name</th>
                                    <th>Salt</th>
                                    <th>Price</th>
                                    {/* <th>Category</th> */}
                                    <th>Stock Quantity</th>
                                    <th>Manufature Date</th>
                                    <th>Expiry Date</th>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{ item.barcode }</td>
                                                <td>{ item.name }</td>
                                                <td>{ item.salt }</td>
                                                <td>{ item.price}</td>
                                                {/* <td>{ item.category_id }</td> */}
                                                <td>{ item.quantity }</td>
                                                <td>{ item.manufactured_date }</td>
                                                <td>{ item.expiry_date }</td>
                                            </tr>
                                        )
                                    })}
                                        
                                       
                                       
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Col>
                </Row>
         
        </>
    )
}

