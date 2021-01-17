import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';

import { Sidebar } from '../../components/Sidebar/Sidebar';
import { CurrentSessionsPage } from './CurrentSessionsPage/CurrentSessionsPage';
import { CreateSessionPage } from './CreateSessionPage/CreateSessionPage';

import { auth, functions } from '../../firebase';

export const DashboardPage = () => {
  const history = useHistory();
  const match = useRouteMatch();

  const [sessions, setSessions] = useState([]);
  const [emailName, setEmailName] = useState('');

  useEffect(() => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt(
          'Please provide your email to complete the sign-in process.'
        );
      }

      if (!email) {
        email = '';
      }

      setEmailName(email);

      auth
        .signInWithEmailLink(email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn');
          history.replace('/dashboard');
          const getAllSessions = functions.httpsCallable('getAllSessions');
          getAllSessions()
            .then((sessionsResult) => {
              // console.log(result.data);
              setSessions(sessionsResult.data);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((error) => {
          alert(error);
          auth.signOut().finally(() => history.push('/'));
        });
    }
  }, []);

  return (
    <Row className='full-row'>
      <Col xs={2}>
        <Sidebar name={emailName[0]} />
      </Col>
      <Col xs={10}>
        <Row className='groupifier-container'>groupifier</Row>
        <Row>
          <Router>
            <Switch>
              <Route path={`${match.path}/create`}>
                <CreateSessionPage hostName={emailName} />
              </Route>
              <Route path={`${match.path}/`}>
                <CurrentSessionsPage sessions={sessions} />
              </Route>
            </Switch>
          </Router>
        </Row>
      </Col>
    </Row>
  );
};
