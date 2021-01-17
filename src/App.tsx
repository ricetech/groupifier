import React from 'react';
// import logo from './logo.svg';
import './App.scss';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { HomePage } from './pages/HomePage/HomePage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { GroupPage } from './pages/GroupPage/GroupPage';
import { SessionPage } from './pages/SessionPage/SessionPage';

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/dashboard'>
            <DashboardPage />
          </Route>
          <Route path='/group'>
            <GroupPage />
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
  );
}

export default App;
