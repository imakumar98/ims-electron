import React, { useState } from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link, useHistory } from 'react-router-dom'
import { faBoxes, faCoffee, faMoneyBillWaveAlt, faTasks } from '@fortawesome/free-solid-svg-icons'

export default function Menu() {

    const [searchString, setSearchString] = useState();

    const history = useHistory();

    const search = (event) => {
        event.preventDefault();

        console.log(searchString);

        const url = `/search/${searchString}`;

        history.push(url);

        console.log('redirecting page to search');

    }

    const handleChange = event => {
        const value = event.target.value;
        setSearchString(value);

        console.log(searchString);
      
    }

    return (
        <div id="menu-content">
            <div className="container">
                <div className="search-group">
                    <form onSubmit={search}>
                        <div class="input-group mb-3">
                            <input type="text" name="searchString" className="form-control" placeholder="Search by name, category, email" value={searchString} onChange={handleChange}/>
                            <div class="input-group-append">
                                <button class="btn btn-secondary" type="submit">Search</button>
                            </div>
                        </div>
                    </form>
                   
                </div>
                <h2 className="title">Menu</h2>
                <div className="row">
                    <div className="col-md-6">
                        <div className="menu-item">
                            <div className="inner-menu-item">
                                <FontAwesomeIcon icon={faCoffee} />

                                <h3>Products</h3>
                                <p>Add or remove your products to your inventory</p>
                                <Link to="/item/add"><button className="btn btn-secondary">Create</button></Link>{'   '}
                               
                                <Link to="/items"><button className="btn btn-secondary">View</button></Link>{'  '}
                               
                                <Link to="/expiry-list"><button className="btn btn-secondary">To Expire</button></Link>
                            </div>

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="menu-item">
                            <div className="inner-menu-item" style={{background: '#384850'}}>
                            <FontAwesomeIcon icon={faMoneyBillWaveAlt} />

                            <h3>Orders</h3>
                            <p>Manage your orders, add customers, sell products, invoice</p>
                            <Link to="/item/sell"><button className="btn btn-primary">Create</button></Link>{' '}
                            
                            <Link to="/orders"><button className="btn btn-primary">View</button></Link>
                         


                            </div>

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="menu-item">
                            <div className="inner-menu-item" style={{background: '#384850'}}>
                            <FontAwesomeIcon icon={faTasks} />

                            <h3>Todos</h3>
                            <p>Manage your todos, update it for your owner</p>
                            <Link to="/todos"><button className="btn btn-primary">View</button></Link>
                                
                            </div>

                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="menu-item">
                            <div className="inner-menu-item">
                            <FontAwesomeIcon icon={faBoxes} />

                            <h3>Categories</h3>
                            <p>Manage your categories, create categories</p>
                            <Link to="/category/add"><button className="btn btn-secondary">Create</button></Link>{' '}
                                
                                <Link to="/categories"><button className="btn btn-secondary">View</button></Link>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}
