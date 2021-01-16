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
<<<<<<< HEAD
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
=======
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
      </header>
>>>>>>> main
    </div>
  );
}

export default App;
