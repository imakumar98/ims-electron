import React, { useState, useEffect} from 'react'

import {
    Row,
    Col
} from 'reactstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheckCircle} from '@fortawesome/free-solid-svg-icons'

import Database from 'db';
import { Link } from 'react-router-dom';


import getHash from 'services/utils';


export default function Sell() {
    
    const [orderItems, setOrderItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [isError, setIsError] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [taxPercentage, setTaxPercentage] = useState(0);
    const [isOrderCreated, setIsOrderCreated] = useState(false);

    const [values, setValues] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        customerNote: '',
        totalAmount: '',
        discount: 0,
        barcode: ''
    });

    useEffect(async ()=> {

        setIsError(false);
        setErrorMessage('');

        const response  = await Database.get("SELECT * FROM settings WHERE name = 'tax'");

        setTaxPercentage(response.value);

    }, []);



    const handleChange = event => {
        const value = event.target.value;
        setValues({
            ...values,
            [event.target.name]: value
        });
    }

    const discountChange = event => {
        const value = event.target.value;
        setValues({
            ...values,
            discount: value
        })

        updateTotalAmount();
    }

  

    

    
    var findProduct = event => {
        event.preventDefault();

        const barcode = event.target.barcode.value;

        Database.all(`SELECT items.id, items_meta.barcode, items.name, items.price FROM items_meta INNER JOIN items ON items_meta.item_id = items.id WHERE items_meta.barcode = ${barcode}`)
        .then(items=> {
            if(items.length == 0) {
                setErrorMessage('There is no product for this barcode');
            }else if(items.length == 1) {

                let item = items[0];
        
                item.quantity = 1;

                setOrderItems(orderItems => [...orderItems, item])
                setValues({...values, barcode: ''})

                
            }
            
        })
        .catch(err => {
            console.log(err);
        })
    }


    const updateTotalAmount = () => {

        let subTotalAmount = 0;

        let totalAmount = 0;
   

        orderItems.forEach(orderItem=> {
            console.log(orderItem);
            subTotalAmount += parseInt(orderItem.price)
        })

        let discountedSubtotal = subTotalAmount - (subTotalAmount*(values.discount/100));

        const taxValue = discountedSubtotal * (taxPercentage/100)

        totalAmount = discountedSubtotal + taxValue;

        setTotalAmount(totalAmount);

        setSubTotalAmount(subTotalAmount);

        
    }


    const handleRemoveItem = (orderItemId) => {


        let updatedOrderItem = [];
        orderItems.forEach(orderItem=> {
            if(orderItem.id !== orderItemId) {
                updatedOrderItem.push(orderItem);
            }
        })
        // console.log(updatedOrderItem);
        setOrderItems(updatedOrderItem)

    };



    const placeOrder = async () => {

        const order = {
            customerName: values.customerName,
            customerEmail: values.customerEmail,
            customerPhone: values.customerPhone,
            customerNote: values.customerNote,
            totalAmount: totalAmount
        }

       
        if(orderItems.length == 0) {
            setIsError(true);
            setErrorMessage('Please add atleast one product');

            return;
        }


        try {

            const orderId = getHash(new Date().toString());


            //Place validaion here
            const newOrder = await Database.run(`INSERT INTO orders (id, customer_name, customer_email, customer_phone, customer_note, total_amount, discount) VALUES ('${orderId}', '${order.customerName}', '${order.customerEmail}', '${order.customerPhone}', '${order.customerNote}', '${order.totalAmount}', '${order.discount}')`);

            if(newOrder) {

                orderItems.forEach(async (orderItem)=> {

                    let orderItemId = getHash(new Date().toString() + orderItem.id);

                    const response = await Database.run(`INSERT INTO order_items (id, item_id, order_id, quantity) VALUES ('${orderItemId}', '${orderItem.id}', '${orderId}', '${orderItem.quantity}')`);
                    
                    await Database.run(`UPDATE items SET quantity = quantity - '${orderItem.quantity}' WHERE id = '${orderItem.id}'`);
                })
                setValues({});
                setOrderItems([]);
                setIsOrderCreated(true);

            }else{
                setIsError(true);
                setErrorMessage('Something went wrong');
            }

        }
        catch(e) {
            setIsError(true);
            setErrorMessage('Something went wrong');
        }


        

    }


    





    return (
        <>
            {!isOrderCreated && 
            <Row>
              
                <Col md={{ size: "8" }}>

                    <div className="sell-form">
                        <h2 className="title">Sell Products</h2>
                        <br></br>
                        {/* <form> */}
                            <fieldset>
                                <legend>Customer Information: </legend>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Customer Name </label>
                                            <input type="text" name="customerName" className="form-control" value={values.customerName} onChange={handleChange}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Customer Email</label>
                                            <input type="text" name="customerEmail" className="form-control" value={values.customerEmail} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Customer Phone number</label>
                                            <input type="text" name="customerPhone" className="form-control" value={values.customerPhone} onChange={handleChange}/>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label>Note</label>
                                            <input type="text" name="customerNote" className="form-control" value={values.customerNote} onChange={handleChange}/>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>

                            <fieldset>
                                <legend>Product Details: </legend>
                                <div className="row">
                                    <div className="col-md-12">
                                        <form onSubmit={findProduct}>
                                            <div class="input-group mb-3">
                                                <input type="text" class="form-control" placeholder="Scan Barcode" name="barcode" value={ values.barcode } onChange={handleChange} />
                                                <div class="input-group-append">
                                                    <button class="btn btn-outline-primary" type="submit">Find Product</button>
                                                </div>
                                                
                                            </div>
                                            {errorMessage.length > 0 && 
                                                <p><span className="text-danger">{errorMessage}</span></p>
                                            }
                                            
                                        </form>
                                    </div>
                                </div>
                                
                                { orderItems.length > 0 &&

                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="order-item-div">
                                            <div className="table-responsive">
                                                <table className="table">
                                                    <thead>
                                                        <th>Sno.</th>
                                                        <th>Product Code</th>
                                                        <th>Product Name</th>
                                                        <th>Quantity</th>
                                                        <th>Amount</th>
                                                        <th>Remove</th>
                                                    </thead>
                                                    <tbody>
                                                        { orderItems.map((orderItem, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{orderItem.barcode}</td>
                                                                    <td>{orderItem.name}</td>
                                                                    <td>
                                                                        <input type="number" name="quantity" className="form-control" value={orderItem.quantity}/>
                                                                    </td>
                                                                    <td>{orderItem.price}</td>
                                                                    <td>
                                                                            <button onClick={() => handleRemoveItem(orderItem.id)} className="btn btn-danger">
                                                                                <FontAwesomeIcon icon={ faTrash } />
                                                                            </button>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        }) }
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                                
                            </fieldset>
                            <br></br>

                            <input type="button" name="submit" className="btn btn-primary btn-block" value="Place Order" onClick={() => placeOrder()}/>
                            
                        {/* </form> */}
                    </div>
                </Col>
                <Col md={{ size: "4" }}>
                    <div className="price-calculator">
                        <h5>Calculation</h5>
                        <br></br>
                        <ul class="price-calculator-list">
                            <li><b>Subtotal</b></li>
                            <li><b>:</b></li>
                            <li>{subTotalAmount}</li>
                        
                        </ul>
                       
                        <ul class="price-calculator-list">
                            <li><b>Discount (%)</b></li>
                            <li><b>:</b></li>
                            <li>
                                <input type="number" name="discount" className="form-control" style={{ width:'65px' }} onChange={discountChange}  value={values.discount}/>
                            </li>
                        
                        </ul>
                        <ul class="price-calculator-list">
                            <li><b>Taxes</b></li>
                            <li><b>:</b></li>
                            <li>{ taxPercentage }%</li>
                        
                        </ul>
                        <ul class="price-calculator-list">
                            <li><b>Total</b></li>
                            <li><b>:</b></li>
                            <li>{totalAmount}</li>
                        
                        </ul>
                        
                        
                        <br/>
                        <button className="btn btn-primary btn-block" type="button" onClick={()=> updateTotalAmount() }>Update Amount</button>

                        <input type="button" className="btn btn-primary btn-block" value="Place Order" onClick={() => placeOrder()}/>
                    </div>
                </Col>

            </Row>

            }

            {isOrderCreated && 
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="success text-center">
                        <FontAwesomeIcon style={{ fontSize: '4rem', color: '#218838' }} icon={ faCheckCircle } />

                            <h4>Success</h4>
                            <p>Order created successfully!</p>
                            <p>If you have internet, you may press sync button to make it sync</p>
                            <Link to="/menu"><button className="btn btn-success">Go to Dashboard</button></Link>
                        </div>
                    </div>
                </div> 
            
            }
        

            </>
    )
}


