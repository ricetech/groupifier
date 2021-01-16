import React from 'react';
// import logo from './logo.svg';
import './App.scss';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { HomePage } from './pages/HomePage/HomePage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { GroupBuilderPage } from './pages/GroupBuilderPage/GroupBuilderPage';

function App() {
  return (
    <div className='App'>
      <Router>
        <Switch>
          <Route path='/dashboard'>
            <DashboardPage />
          </Route>
          <Route path='/group-builder'>
            <GroupBuilderPage />
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
