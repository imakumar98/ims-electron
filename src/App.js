import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//Import Layout
import AuthLayout from 'layouts/AuthLayout'; 



//Import pages
import Login from './pages/login';

import { AddItem, Show, Sell, OrderSuccess, ExpiryList }  from 'pages/item'

import { AddCategory }  from 'pages/category'

import Menu from './pages/menu'


import Orders from './pages/orders';

import OrderItems from './pages/order-items';

import Todos from './pages/todos';


import { AddSupplier, Suppliers } from 'pages/supplier'

// import Suppliers from './pages/supplier/Suppliers';

import Categories from './pages/category/show';

import Search from './pages/Search';



import PageNotFound from 'components/PageNotFound';


import './index.css'

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/item/add">
            <AuthLayout>
              <AddItem/>
            </AuthLayout>
          </Route>


          <Route exact path="/items">
            <AuthLayout>
              <Show/>
            </AuthLayout>
          </Route>

          <Route exact path="/item/sell">
            <AuthLayout>
              <Sell/>
            </AuthLayout>
          </Route>


          <Route exact path="/order-success">
            <AuthLayout>
              <OrderSuccess/>
            </AuthLayout>
          </Route>


          <Route exact path="/orders">
            <AuthLayout>
              <Orders/>
            </AuthLayout>
          </Route>


          <Route exact path="/order-items/:orderId">
            <AuthLayout>
              <OrderItems/>
            </AuthLayout>
          </Route>

          <Route exact path="/todos">
            <AuthLayout>
              <Todos/>
            </AuthLayout>
          </Route>

          <Route exact path="/categories">
            <AuthLayout>
              <Categories/>
            </AuthLayout>
          </Route>
          

          <Route exact path="/category/add">
            <AuthLayout>
              <AddCategory/>
            </AuthLayout>
          </Route>



          <Route exact path="/supplier/add">
            <AuthLayout>
              <AddSupplier/>
            </AuthLayout>
          </Route>

          <Route exact path="/suppliers">
            <AuthLayout>
              <Suppliers/>
            </AuthLayout>
          </Route>


          <Route exact path="/menu">
            <AuthLayout>
            <Menu/>
            </AuthLayout>

          </Route>

          <Route exact path="/expiry-list">
            <AuthLayout>
            <ExpiryList/>
            </AuthLayout>

          </Route>

          <Route exact path="/search/:s">
            <AuthLayout>
            <Search/>
            </AuthLayout>

          </Route>



          <Route exact path="/" component={Login} />
         



          <Route path='*' exact={true} component={PageNotFound} />

        </Switch>
      </Router>
    </>
  );
}

export default App;
