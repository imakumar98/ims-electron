import React, { Component, useState, useEffect} from 'react'

import {
    Container,
    Row,
    Col
} from 'reactstrap'

import Database from 'db';


export default function Show() {
    const [categories, setCategories] = useState([]);
    
    useEffect(async () =>{
        Database.all("SELECT * FROM categories ORDER BY id DESC")
        .then(categories=> {
            console.log(categories);
            setCategories(categories)

        })
        .catch(err=> {
            console.log(err);
        })


    }, [])



    return (
        <Row>
        <Col md={{ size: 10, offset: 1 }}>
            <div className="supplier-table">
                <h2 className="title">Categories</h2>
                <br></br>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            
                            <th>Name</th>
                            <th>Description</th>
                            <th>Created At</th>
                          
                           
                        </thead>
                        <tbody>
                            {categories.map((category, index)=> {
                                    return (
                                        <tr>
                                            
                                            <td>{category.name}</td>
                                            <td>{category.description}</td>
                                            <td>{category.created_at}</td>
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

