import React, { useState, useEffect} from 'react'

import {
    Row,
    Col
} from 'reactstrap'

import Database from 'db';


export default function Suppliers() {
    const [suppliers, setsuppliers] = useState([]);
    
    useEffect(async () =>{
        Database.all("SELECT * FROM suppliers ORDER BY id DESC")
        .then(suppliers=> {
            console.log(suppliers);
            setsuppliers(suppliers)

        })
        .catch(err=> {
            console.log(err);
        })


    }, [])



    return (
        <Row>
        <Col md={{ size: 10, offset: 1 }}>
            <div className="supplier-table">
                <h2>Suppliers</h2>
                <br></br>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Address</th>
                          
                           
                        </thead>
                        <tbody>
                            {suppliers.map((supplier, index)=> {
                                    return (
                                        <tr>
                                            <td>{supplier.id}</td>
                                            <td>{supplier.name}</td>
                                            <td>{supplier.email}</td>
                                            <td>{supplier.address}</td>
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

