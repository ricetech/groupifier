import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { GroupBuilderSuccessPage } from './GroupBuilderSuccessPage/GroupBuilderSuccessPage';
import { GroupSelectionPage } from './GroupSelectionPage/GroupSelectionPage';

import { Participant } from '../../interfaces';


import { Sidebar } from '../../components/Sidebar/Sidebar';

const dummydata: Participant[] = [{ value: 'Bob@email.com', label: 'Bob' }];

export const GroupBuilderPage = () => {
  const match = useRouteMatch();

  return (
    <div>
      <Row className='full-row'>
        <Col xs={2}>
          <Sidebar name='Bob' />
        </Col>
        <Col xs={10}>
          <Router>
            <Switch>
              <Route path={`${match.path}/success`}>
                <GroupBuilderSuccessPage />
              </Route>
              <Route path={`${match.path}/`}>
                <GroupSelectionPage />
              </Route>
            </Switch>
          </Router>
        </Col>
      </Row>
    </div>
  );
};
