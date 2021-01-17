import React from 'react';
// import logo from './logo.svg';
import './App.scss';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { HomePage } from './pages/HomePage/HomePage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { SessionPage } from './pages/SessionPage/SessionPage';
import { GroupBuilderPage } from './pages/GroupBuilderPage/GroupBuilderPage';
import UserProvider from './providers/UserProvider';

function App() {
  return (
    <UserProvider>
      <div className='App'>
        <Router>
          <Switch>
            <Route path='/dashboard'>
              <DashboardPage />
            </Route>
            <Route path='/group-builder'>
              <GroupBuilderPage />
            </Route>
            <Route path='/session'>
              <SessionPage />
            </Route>
            <Route path='/'>
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
