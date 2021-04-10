import React, { Component, useState, useEffect } from 'react'
import moment from 'moment';

import {
    Row,
    Col
} from 'reactstrap'

import Database from 'db'

export default function ExpiryList() {

    const [items, setItems] = useState([]);
    const [filterByMonth, setFilterByMonth] = useState(1);
    const [isLoaded, setIsLoaded] = useState(false);


    async function handleChange(event) {


        const todayDate = moment().format("yy-MM-D");

        const futureDate = moment().add(event.target.value, 'months').format("yy-MM-D");

        setFilterByMonth(event.target.value);

        try {

            const sql = `SELECT * FROM items WHERE expiry_date between '${todayDate}' AND '${futureDate}'`;
            
            const response = await Database.all(sql);

            setItems(response);

        }catch(e) {
            alert('Something went wrong');
        }
    



    }

    useEffect(() =>{


        const todayDate = moment().format("yy-MM-D");
        const futureDate = moment().add(1, 'months').format("yy-MM-D");

        
        const sql = `SELECT * FROM items WHERE expiry_date between '${todayDate}' AND '${futureDate}'`;

        Database.all(sql)
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
                        <h2 class="title">Products To Expire</h2>
                        <br></br>
                        <div className="filter-list">
                            <div className="form-group">
                                <label>Filter By Months</label>
                                <select name="filter-by" className="form-control" value={filterByMonth} onChange={handleChange}>
                                    <option value="1">1 Month</option>
                                    <option value="3">3 Months</option>
                                    <option value="6">6 Months</option>
                                    <option value="9">9 Months</option>
                                    <option value="12">12 Months</option>
                                </select>
                            </div>
                        </div>
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

