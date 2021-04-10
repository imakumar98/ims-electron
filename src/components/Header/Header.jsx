import React, { useState, useEffect} from 'react'
import {  Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTh, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { apiURL }  from 'config';

import Database from 'db';

import logo from 'static/darmaltun-logo.jpg'

export default function Header() {

    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isInternetWorking, setIsInternetWorking] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [isSynced, setIsSynced] = useState(false);
    const [username, setUsername] = useState('');
    const [lastSync, setLastSync] = useState('');

    useEffect(async () => {
      const record = await Database.get(`SELECT * FROM settings WHERE name = 'username'`);

      const lastSyncRecord = await Database.get(`SELECT * FROM settings WHERE name = 'lastSync'`);

      setUsername(record.value)
      setLastSync(lastSyncRecord.value)
    }, []);

    const syncApp = async () => {

      try {

        setIsSyncing(true);
        setIsInternetWorking(true);


        const company_id  = await Database.get("SELECT * FROM settings WHERE name = 'company_id'");

        const user_id  = await Database.get("SELECT * FROM settings WHERE name = 'user_id'");


        const response = await fetch(`${apiURL}/app/settings?company_id=${company_id.value}&user_id=${user_id.value}`);

        const data = await response.json();

        const tax = data.data.tax;

    

        const suppliers = data.data.suppliers;

        const todos = data.data.todos;

        const updateTax = await Database.run(`UPDATE settings SET value = '${tax}' WHERE name = 'tax'`);

       
        


        if(updateTax) {

            const categories = await Database.all(`SELECT * FROM categories`);

            const products = await Database.all(`SELECT * FROM items`);

            const orders = await Database.all(`SELECT * FROM orders`);

            const orderItems = await Database.all(`SELECT * FROM order_items`);


         

            const data = {
                company_id: company_id.value,
                user_id: user_id.value,
                categories: categories,
                items: products,
                orders,
                orderItems
            }

            const dataSyncResponse = await fetch(`${apiURL}/app/data`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({data})
            });

            if(dataSyncResponse.status !== 200) {
              throw new Error('Something went wrong');
            }

            setIsError(false);

            console.log(`response from fetch : `, dataSyncResponse);

            const dataSyncResponseJSON = await dataSyncResponse.json();

            // console.log(dataSyncResponseJSON);

            if(dataSyncResponseJSON.success) {
              setIsSyncing(false);

              setIsSynced(true);

              setTimeout(() =>{setIsSynced(false)}, 3000);
            }else{
              setIsError(true);
              setErrorMessage('Something went wrong');
            }


        }
      }
      catch(e) {
        if(e.message == 'Failed to fetch') {
          setIsInternetWorking(false);
          
        }
        setIsSyncing(false);
        setIsError(true);
        setErrorMessage(e.message);
      }

        

    }



    //Method to sync data only (categories, items, orders)
    const syncData = async () => {

      try {


        // setIsSyncing(true);
        // setIsInternetWorking(true);

      const record = await Database.all(`SELECT value FROM settings WHERE name = 'lastSync' OR name = 'company_id'`)
      
      let company_id = record[0].value;
      let lastSync = record[1].value;


      const categories = await Database.all(`SELECT * FROM categories WHERE updated_at > '${lastSync}'`);
      const itemsMeta = await Database.all(`SELECT * FROM items_meta WHERE updated_at > '${lastSync}'`);
      const items = await Database.all(`SELECT * FROM items WHERE updated_at > '${lastSync}'`);
      const orders = await Database.all(`SELECT * FROM orders WHERE updated_at > '${lastSync}'`);
      const orderItems = await Database.all(`SELECT * FROM order_items WHERE updated_at > '${lastSync}'`);

      const data = {
          company_id,
          last_sync: lastSync,
          categories,
          items,
          itemsMeta,
          orders,
          orderItems  
      }

      const syncResponse = await fetch(`${apiURL}/app/sync-data`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({data})
      });

      let webResponse = await syncResponse.json();


      console.log(webResponse);

      let webCategories = webResponse.data.web_categories;
      let webItems = webResponse.data.web_items;
      let webItemsMeta = webResponse.data.web_items_meta;


      webCategories.forEach(async (category) => {
        await Database.run(`INSERT INTO categories (id, name, description, deleted, created_at, updated_at) VALUES ('${category.app_category_id}', '${category.name}', '${category.description}', 0, '${category.created_at}', '${category.updated_at}') `);
      })


      webItemsMeta.forEach(async (itemMeta) => {
        await Database.run(`INSERT INTO items_meta (id, barcode, information, item_id, created_at, updated_at) VALUES ('${itemMeta.app_id}', '${itemMeta.barcode}', '${itemMeta.information}', '${itemMeta.item_id}',  '${itemMeta.created_at}', '${itemMeta.updated_at}') `);
      })


      webItems.forEach(async (item) => {
        await Database.run(`INSERT INTO items (id, name, salt, price, quantity, category_id, deleted, created_at, updated_at) VALUES ('${item.app_item_id}', '${item.name}', '${item.salt}', '${item.price}', '${item.quantity}', '${item.category_id}', '${item.deleted}', '${item.created_at}', '${item.updated_at}') `);
      })


     


      await Database.run(`UPDATE settings SET value = (datetime('now','localtime')) WHERE name = 'lastSync'`);



    }
    catch(e) {
      if(e.message == 'Failed to fetch') {
        setIsInternetWorking(false);
        
      }
      setIsSyncing(false);
      setIsError(true);
      setErrorMessage(e.message);

      console.log('error occured');
    }


    }
    

    return (
        <header id="header">
          {!isInternetWorking && 
              <div className="text-center" style={{background: 'red', color: '#FFF', padding: '5px'}}>Please check your internet connection</div>
          
          }

          {isError && 
              <div className="text-center" style={{background: '#dc3545', color: '#FFF', padding: '5px'}}>{errorMessage}</div>
          
          }

        {isSynced && 
              <div className="text-center" style={{background: '#28a745', color: '#FFF'}}>Sync Successful...</div>
          
          }

          <div className="header">
            <div className="brand">
              <div className="brand-logo">
                  <img className="img-responsive" src={logo} width="80px" height="80px"/>

              </div>

            </div>
            <div className="back">
            <Link to="/menu"><button className="btn btn-primary"><FontAwesomeIcon icon={faTh}/> Dashboard</button></Link>

            </div>
            <div className="action-buttons">
                <button className="btn btn-success btn-lg my-2 my-sm-0" disabled={isSyncing} type="button" style={{ marginRight: '15px', padding: '8px 30px' }} onClick={syncData}>
                  {isSyncing ? ('Syncing...') : ('Sync')}
                    
                </button>{lastSync}{' '}
                <span>Hi, { username ? username : 'Team Member'}</span>{'  '}
               <Link to="/"><button className="btn btn-danger btn-sm"  type="button" style={{ marginRight: '15px', padding: '8px 30px' }} ><FontAwesomeIcon icon={ faSignOutAlt }/></button></Link>

            </div>
          </div>

          
        </header>   
    )
}
