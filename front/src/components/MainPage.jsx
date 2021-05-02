import React, { useState } from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Login from './Login';
import Welcome from './Welcome';
import Orders from './Orders';
import OrderCreation from './OrderCreation';
import '../styles/MainPage.css';

const { Header, Content, Footer } = Layout;

function MainPage() {
  const [view, setView] = useState(0);

  const pageName = ['Home', 'Order List', 'Creation of the Orders'];
  const pathRoute = ['/home', '/orders', '/orderCreation'];
  const viewObjects = [<Welcome />, <Orders />, <OrderCreation />];

  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          <Login />
        </Route>
        <Layout className='lay'>
          <NavBar setView={setView} />
          <Layout className='site-layout'>
            <Header className='site-layout-background header-container'>
              {pageName[view]}
            </Header>
            <Content className='top'>
              <div className='space' />
              <div className='site-layout-background container'>
                <Route path={pathRoute[view]}>{viewObjects[view]}</Route>
              </div>
            </Content>
            <Footer>Made by David Arias</Footer>
          </Layout>
        </Layout>
      </Switch>
    </Router>
  );
}

export default MainPage;
