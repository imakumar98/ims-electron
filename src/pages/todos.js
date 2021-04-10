import React, { Component, useState, useEffect } from 'react'

import {
    Container,
    Row,
    Col
} from 'reactstrap'


import Database from 'db';





export default function Todos() {
    
    const [todos, setTodos] = useState([]);
    
    useEffect(async () =>{
        Database.all("SELECT * FROM todos ORDER BY id DESC")
        .then(todos=> {
            console.log(todos);
            setTodos(todos)

        })
        .catch(err=> {
            console.log(err);
        })


    }, [])

    return (
        <Row>
            <Col md={{ size: 10, offset: 1 }}>
                <div className="order-table">
                    <h2 className="title">Todos</h2>
                    <br></br>
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                               
                                <th>Created At</th>
                                
                            </thead>
                            <tbody>
                                {todos.map((todo, index)=> {
                                    return (
                                        <tr>
                                            <td>{todo.title}</td>
                                            <td>{todo.description}</td>
                                            <td>
                                                <select className="form-control">
                                                    <option>PENDING</option>
                                                    <option>COMPLETE</option>
                                                    <option>WIP</option>
                                                </select>
                                                
                                                </td>
                                            <td>{todo.created_at}</td>

                                                                    
                                         
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


