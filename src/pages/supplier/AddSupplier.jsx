import React, { Component, useState, useEffect } from 'react'

import Database from 'db'

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'




export default function AddSupplier() {

    const [values, setValues] = useState({
        name: '',
        email: '',
        address: ''
    })
    const [isSupplierCreating, setIsSupplierCreating] = useState(false);
    const [isSupplierCreated, setIsSupplierCreated] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');



    const handleChange = (event) => {
        const value = event.target.value;
        setValues({
            ...values,
            [event.target.name]: value
        });
    }

    const createSupplier = async (event) => {
        event.preventDefault();

        const newSupplier = {
            name: values.name,
            email: values.email,
            address: values.address,
        }

        if(newSupplier.name.length == 0) {
            setIsError(true);
            setErrorMessage('Supplier name is required');

            return;
        }

        try {

            setIsSupplierCreating(true);

            const response = await Database.run(`INSERT INTO suppliers (name, email, address) VALUES ('${newSupplier.name}', '${newSupplier.email}', '${newSupplier.address}')`);


            setIsSupplierCreated(true);
            setIsSupplierCreating(false);

            setValues({
                name: '',
                email: '',
                address: '',
            })

            setTimeout(()=> {
                setIsSupplierCreated(false)
            }, 2000)
            

        }
        catch(e) {  


            setIsError(true);
            setErrorMessage(e.message);

        }

        
    }

    return (
        <>
         
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 offset-md-3">
                            <div className="add-supplier">
                                <h2>Add Supplier</h2>
                                <br></br>
                                <form onSubmit={createSupplier} method="POST">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" name="name" className="form-control" value={values.name} onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="text" name="email" className="form-control" value={values.email} onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <textarea className="form-control" name="address" onChange={handleChange}>{values.address}</textarea>
                                   
                                    </div>
                                    <br></br>
                                    {isError && <div className="alert alert-danger">{errorMessage}</div>}
                                    {isSupplierCreated && <div className="alert alert-success">'Supplier created successfully</div>}

                                    <button className="btn btn-primary btn-block" disabled={isSupplierCreating}>
                                        {isSupplierCreating ? ('Saving...') : ('Save')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
        
        
    </>
    )
}


