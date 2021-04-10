import React, { Component, useState } from 'react'
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Label,
    Input,
    Button
} from 'reactstrap'

import { Link, Redirect } from 'react-router-dom';

import { apiURL, isInitialLogin } from 'config'

import Database from 'db';

import { useHistory } from "react-router-dom";

import Footer from 'components/Footer'

import logo from 'static/darmaltun-logo.jpg';


export default function Login() {

    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [isError, setIsError] = useState(false);
    const [isLogging, setIsLogging] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const history = useHistory();

    const handleChange = event => {
        const value = event.target.value;
        setValues({
            ...values,
            [event.target.name]: value
        });
    }

    const submitLogin = async (event) => {
        event.preventDefault();

        try {

            setIsError(false)
            setIsLogging(true)

            const {value} = await Database.get("SELECT value FROM settings WHERE name = 'isInitialLogin'");

            //If it's an initial login
            if(value == 'true') {


                const response = await fetch(`${apiURL}/login`, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: values.email,
                        password: values.password
                    })
                })
    
                const data = await response.json();
    
                if (data.error) {
    
                    setIsError(true);
                    setIsLogging(false);
                    setErrorMessage('Invalid Credentials');
    
                    return;
                }
    
                const accessToken = data.access_token;
    
                const user = data.user;
    
                await Database.run(`UPDATE settings SET value = '${user.company_id}' WHERE name = 'company_id'`);
                await Database.run(`UPDATE settings SET value = '${user.id}' WHERE name = 'user_id'`);
                await Database.run(`UPDATE settings SET value = '${user.name}' WHERE name = 'username'`);
                await Database.run(`UPDATE settings SET value = '${user.password_plain}' WHERE name = 'password'`);
                await Database.run(`UPDATE settings SET value = '${user.email}' WHERE name = 'email'`);
                await Database.run(`UPDATE settings SET value = 'false' WHERE name = 'isInitialLogin'`);
                // await Database.run(`UPDATE settings SET value = '${user.password_plain}' WHERE name = 'password'`);
    
                history.push("/menu");

            }else {
                //If its not an initial login, then offline login will also work

                console.log('im logging in without internet');
                console.log(`${values.email}  fdsfsdf f   ${values.password}`)
                const email = await Database.get(`SELECT value FROM settings WHERE value = '${values.email}'`);
                const password = await Database.get(`SELECT value FROM settings WHERE value = '${values.password}'`);

                if(!email || !password) {
                    throw new Error('Invalid username or password');
                }
             

                history.push("/menu");
            }

            
          

            
        }
        catch (e) {

            setIsError(true);
            setIsLogging(false);
            setErrorMessage(e.message);

        }

    }


    return (
        <>
        <Container>
            <Row>
                <Col md={{ size: 6, offset: 3 }} xs={{ size: 8, offset: 2 }}>
                    <div className="login-outer-div">
                        <div className="brand-logo text-center">
                            <img className="img-responsive" src={logo} width="150px" height="150px"/>

                        </div>
                        <br/>
                        {/* <h2 className="brand-name">Darmaltun</h2> */}
                        <div className="login-form">
                            <Form onSubmit={submitLogin}>

                                <h3>Sign in to your account</h3>
                                <br />
                                <FormGroup>
                                    <Label for="email">Email Address</Label>
                                    <Input type="text" name="email" id="email" value={values.email} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup>
                                    <Label for="password">Password</Label>
                                    <Input type="password" name="password" id="password" value={values.password} onChange={handleChange} />
                                </FormGroup>
                                <FormGroup style={{ paddingLeft: '20px' }}>
                                    <Input type="checkbox" name /> Load Images?

                                </FormGroup>
                                {isError &&
                                    <div className="alert alert-danger">{errorMessage}</div>
                                }

                                <Button color="primary" disabled={isLogging} type="submit" block="true">
                                    {isLogging ? ('Logging...') : ('Login')}
                                </Button>
                            </Form>
                        </div>

                    </div>
                   
                </Col>
            </Row>
        </Container>
        <Footer/>
        </>
    )
}
