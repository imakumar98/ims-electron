import React, { Component, useState, useEffect } from 'react'
import {
    Row,
    Col
} from 'reactstrap'
import { Link } from 'react-router-dom'

import Database from 'db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle} from '@fortawesome/free-solid-svg-icons'

import getHash from 'services/utils';


export default function AddItem() {
    
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [itemMetas, setItemMetas] = useState([]);
    const [isMetaAdded, setisMetaAdded] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isItemCreated, setIsItemCreated] = useState(false);

    const [submitted, setSubmitted] = useState(false);
    const [values, setValues] = useState({
        barcode: '',
        information: '',
        name: '', 
        salt: '',
        price: '',
        quantity: '',
        categoryId: '',
        manufacturedDate: '',
        expiryDate: ''
    });

    useEffect(async () => {
       const categories =  await Database.all("SELECT * FROM categories");

       const suppliers = await Database.all(`SELECT * FROM suppliers`);

       setCategories(categories);
       setSuppliers(suppliers);
        
    }, [])

    const handleBarcodeChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            barcode: event.target.value,
        }));
    };

    const handleInformationChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            information: event.target.value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitted(true);

        const itemMeta = {
            barcode: values.barcode,
            information: values.information
        }

        if(itemMeta.barcode.length > 0 || itemMeta.information.length > 0) {
            setErrorMessage('');

            // Database.run(`INSERT INTO items_meta (barcode, information) VALUES ('${itemMeta.barcode}', '${itemMeta.information}')`)
            // .then(response => {
                setItemMetas(itemMetas=> [...itemMetas, itemMeta]);
                setValues(values => ({barcode: '', information: ''}))
            // })
            // .catch(err => {
            //     console.log(err)
            // })
        }else {

            setErrorMessage('Please type atleast one value');

        }

       


    }


    const handleChange = event => {
        const value = event.target.value;
        setValues({
            ...values,
            [event.target.name]: value
        });
    }


    const createItem = async (event) => {
        event.preventDefault();

        

        const newItem = {
            barcode: itemMetas[0].barcode,
            name: values.name,
            salt: values.salt,
            quantity: values.quantity,
            price: values.price,
            categoryId: values.categoryId,
            supplierId: values.supplierId,
            manufacturedDate: values.manufacturedDate,
            expiryDate: values.expiryDate,
        }

        let id = getHash(new Date().toString());


        const response = await Database.run(`INSERT INTO items (id, name, salt, price, quantity, category_id, manufactured_date, expiry_date, supplier_id) VALUES ('${id}', '${newItem.name}', '${newItem.salt}', '${newItem.price}', '${newItem.quantity}', '${newItem.categoryId}', '${newItem.manufacturedDate}', '${newItem.expiryDate}', '${newItem.supplierId}')`)
        
        

        if(response) {

            const itemId = id;

            itemMetas.forEach(async (itemMeta)=> {

                let itemMetaId = getHash(new Date().toString() + itemMeta.barcode);

               await Database.run(`INSERT INTO items_meta (id, barcode, information, item_id) VALUES ('${itemMetaId}', '${itemMeta.barcode}', '${itemMeta.information}', '${itemId}')`)

            })

            setIsItemCreated(true);
        }
    }

    return (
        <>
        {!isItemCreated &&
        <div>
        <Row>
            <Col md="6" md={{ size: 6, offset: 3 }}>
                <div className="add-item-form">

                        {!isMetaAdded && 

                            <form method="POST" onSubmit = { handleSubmit }>
                                <h2 className="title">Add Product</h2>
                                <br></br>

                                <div className="form-group">
                                    <label htmlFor="itemName"><b>Barcode (Type or Scan in textbox)</b></label>
                                    <input type="text" className="form-control" name="barcode"  value={ values.barcode} onChange={ handleBarcodeChange }/>
                                </div>

                                <p className="text-center">OR</p>

                                <div className="form-group">
                                    <label htmlFor="itemName"><b>Product Information</b></label>
                                    <input type="text" className="form-control" name="productInformation" value={ values.information} onChange={ handleInformationChange }/>
                                </div>
                                
                                <br/>
                                {errorMessage.length > 0 &&
                                    <div className="alert alert-danger">{errorMessage}</div>
                                }
                                <button type="submit" className="btn btn-default btn-block btn-primary">Add More Barcode</button>
                                <button type="button" className="btn btn-default btn-block btn-outline-primary" onClick={() => setisMetaAdded(true)}>Proceed to Add Product Information</button>

                            </form>

                        }

                        {isMetaAdded && 
                        <div id="main-form">
                            <form onSubmit={createItem}>
                                <h2>Product Information</h2>
                                <div className="form-group">
                                    <label htmlFor="itemName">Name</label>
                                    <input type="text" className="form-control" name="name" value={values.name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="itemName">Salt</label>
                                    <input type="text" className="form-control" name="salt" value={values.salt} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="itemName">Price</label>
                                    <input type="text" className="form-control" name="price" value={values.price} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="itemName">Quantity</label>
                                    <input type="text" className="form-control" name="quantity" value={values.quantity} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="categoryId">Category</label>
                                    <select name="categoryId" className="form-control" id="categoryId" onChange={handleChange}>
                                        <option value="">Choose category</option>
                                        { categories.map((category, index) => {
                                            return (
                                                <option value={category.id} key={index}>{category.name}</option>
                                            )
                                        }) }


                                    </select>

                                </div>
                                <div className="form-group">
                                    <label htmlFor="supplierId">Suppliers</label>
                                    <select name="supplierId" className="form-control" id="supplierId" onChange={handleChange}>
                                        <option value="">Choose supplier</option>
                                        { suppliers.map((supplier, index) => {
                                            return (
                                                <option value={supplier.id} key={index}>{supplier.name}</option>
                                            )
                                        }) }


                                    </select>

                                </div>
                                <div className="form-group">
                                    <label htmlFor="manufacturedDate">Manufactured Date</label>
                                    <input type="date" className="form-control" name="manufacturedDate" value={values.manufacturedDate} onChange={handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="itemName">Expiry Date</label>
                                    <input type="date" className="form-control" name="expiryDate" value={values.expiryDate} onChange={handleChange}/>
                                </div>
                                {/* <div className="form-group">
                                    <label htmlFor="image">Images</label>
                                    <input type="file" name="image" className="form-control" id=""/>
                                </div> */}
                                <br/>
                                <input type="submit" className="btn btn-primary btn-block" value="SAVE"/>
                            </form>
                        </div>
                    }
                    
                </div>
            </Col>
        </Row>
        <br/><br/><br/>
        {itemMetas.length > 0 &&
        <Row>
            {!isMetaAdded && 
            <Col md="8" md={{ size: 8, offset: 2 }}>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <th>S No.</th>
                            <th>Barcode</th>
                            <th>Product Information</th>

                        </thead>
                        <tbody>
                            {itemMetas.map((itemMeta, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{ index+1 }</td>
                                        <td>{ itemMeta.barcode }</td>
                                        <td>{ itemMeta.information }</td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </Col>
            }
        </Row>
        }
        </div>

        }

        {isItemCreated && 
        
        <div className="row">
            <div className="col-md-6 offset-md-3">
                <div className="success text-center">
                <FontAwesomeIcon style={{ fontSize: '4rem', color: '#218838' }} icon={ faCheckCircle } />

                    <h4>Success</h4>
                    <p>Product added successfully!</p>
                    <p>If you have internet, you may press sync button to make it sync</p>
                    <Link to="/menu"><button className="btn btn-success">Go to Dashboard</button></Link>
                </div>
            </div>
        </div> 
        }


    </>
    )
}


