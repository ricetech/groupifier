import React from 'react';
import logo from './logo.svg';
import './App.scss';

import { HomePage } from './pages/HomePage/HomePage';
import { DashboardPage } from './pages/DashboardPage/DashboardPage';
import { GroupPage } from './pages/GroupPage/GroupPage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path='/dashboard'>
            <DashboardPage />
          </Route>
          <Route path='/group'>
            <GroupPage />
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
