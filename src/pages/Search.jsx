import React, { useState, useEffect } from 'react'

import { Link, useParams } from 'react-router-dom';

import Database from 'db'; 

export default function Search() {

    const [searchString, setSearchString] = useState('');

    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);

    const params = useParams();

    useEffect(async () => {

        

        const items = await Database.all(`SELECT * FROM items WHERE barcode LIKE name LIKE '%${params.s}%' OR salt LIKE '%${params.s}%'`);

        const categories = await Database.all(`SELECT * FROM categories WHERE name LIKE '%${params.s}%' OR description LIKE '%${params.s}%'`);

        const orders = await Database.all(`SELECT * FROM orders WHERE customer_name LIKE '%${params.s}%' OR customer_email LIKE '%${params.s}%' OR customer_phone LIKE '%${params.s}%'`);


        setSearchString(params.s);
        setItems(items);
        setOrders(orders);
        setCategories(categories);
        
    }, [])


    

    return (
        <div>
            <h2>Result for : '{searchString}'</h2>
            <br/>

            <div className="items-result">
                <h3>Products</h3>
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
            <br/>

            <div className="categories-result">
                <h3>Categories</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                          
                           
                        </thead>
                        <tbody>
                            {categories.map((category, index)=> {
                                    return (
                                        <tr key={index}>
                                            <td>{category.id}</td>
                                            <td>{category.name}</td>
                                            <td>{category.description}</td>
                                        </tr>
                                    )
                                })}
                            
                           
                        </tbody>
                    </table>
                </div>
            </div>
            <br/>

            <div className="orders-result">
                <h3>Orders</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <th>Order Id</th>
                            <th>Customer Name</th>
                            <th>Customer Email</th>
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
                                        
                                        <td>{order.total_amount}</td>
                                    </tr>
                                )
                            })}
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>
  
        </div>
    )
}
