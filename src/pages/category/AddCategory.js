import React, { Component, useState, useEffect } from 'react'

import Database from 'db'

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'


import getHash from 'services/utils';




export default function AddCategory() {

    const [values, setValues] = useState({
        name: '',
        description: '',
        categoryType: ''
    })
    const [categoryTypes, setCategoryTypes] = useState([]);
    const [isCategoryCreating, setIsCategoryCreating] = useState(false);
    const [isCategoryCreated, setIsCategoryCreated] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    useEffect(async ()=> {

        setIsError(false);

        const categoryTypes = await Database.all("SELECT * FROM category_types");

        setCategoryTypes(categoryTypes)

    }, []);


    const handleChange = (event) => {
        const value = event.target.value;
        setValues({
            ...values,
            [event.target.name]: value
        });
    }

    const createCategory = async (event) => {
        event.preventDefault();

        const newCategory = {
            name: values.name,
            description: values.description,
     
        }

        if(newCategory.name.length == 0) {
            setIsError(true);
            setErrorMessage('Category name is required');

            return;
        }

        try {

            setIsCategoryCreating(true);

            let id = getHash(new Date().toString());

            const response = await Database.run(`INSERT INTO categories (id, name, description) VALUES ('${id}', '${newCategory.name}', '${newCategory.description}')`);


            setIsCategoryCreated(true);
            setIsCategoryCreating(false);

            setValues({
                name: '',
                description: '',
                categoryType: '',
            })

            setTimeout(()=> {
                setIsCategoryCreated(false)
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
                                <h2 className="title">Add Category</h2>
                                <br></br>
                                <form onSubmit={createCategory} method="POST">
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" name="name" className="form-control" value={values.name} onChange={handleChange}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Description</label>
                                        <input type="text" name="description" className="form-control" value={values.description} onChange={handleChange}/>
                                    </div>
                                   
                                    <br></br>
                                    {isError && <div className="alert alert-danger">{errorMessage}</div>}
                                    {isCategoryCreated && <div className="alert alert-success">'Category created successfully</div>}

                                    <button className="btn btn-primary btn-block" disabled={isCategoryCreating}>
                                        {isCategoryCreating ? ('Saving...') : ('Save')}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            
            
        
           
        
    </>
    )
}


