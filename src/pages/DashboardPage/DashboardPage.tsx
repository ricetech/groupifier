import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';

import { Sidebar } from '../../components/Sidebar/Sidebar';
import { CurrentSessionsPage } from './CurrentSessionsPage/CurrentSessionsPage';
import { CreateSessionPage } from './CreateSessionPage/CreateSessionPage';

export const DashboardPage = () => {
  const match = useRouteMatch();
  return (
    <Row className='full-row'>
      <Col xs={2}>
        <Sidebar name='Bob' />
      </Col>
      <Col xs={10}>
        <Row className='groupifier-container'>groupifier</Row>
        <Row>
          <Router>
            <Switch>
              <Route path={`${match.path}/create`}>
                <CreateSessionPage />
              </Route>
              <Route path={`${match.path}/`}>
                <CurrentSessionsPage />
              </Route>
            </Switch>
          </Router>
        </Row>
      </Col>
    </Row>
  );
};
